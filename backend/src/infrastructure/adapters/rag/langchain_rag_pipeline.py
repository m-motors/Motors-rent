import os
import time
import uuid
import requests
from typing import Any, List, Optional, Dict, Union

from ollama import chat
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader, PyPDFLoader, JSONLoader

from src.application.ports.output.rag_pipeline import RAGPipeline
from src.domain.models.document_rag import DocumentRAG, DocumentRAGStatus


class LangcahinRAGPipeline(RAGPipeline):
    def __init__(self, host):
        self.ollama_host = host if host else "http://ollama:11434"
        self.llm_model_name="mistral:7b"  # Alternative :  'llama2:7b

        self.default_options = {
            'temperature': 1.5,
            'top_k': 100,
            'top_p': 0.9,
            'num_predict': 512,
            'num_ctx': 2048,
            'repeat_penalty': 1.1,
            'repeat_last_n': 64,
            'num_gpu': 1,
            'stop': ['\n'],
            'seed': 12345
        }

        self.chats = [
            {
                "chat": {
                    "history": [],
                    "llm_model_name": "mistral:7b",
                    "options": self.default_options,
                    "stream": False
                },
                "collection": None,
                "description": "This is the chat by default",
                "id": "11111111-1111-1111-1111-111111111111",
                "name": "Default chat", 
            }
        ]

        self.model_name="all-MiniLM-L6-v2"
        self.device="cpu"
        self.is_encode_kwargs= True

        self.embedders = []


        self.persist_directory = 'chroma'
        self.collection_name = 'default'
        self.collections = []
        self.chunk_size = 200
        self.chunk_overlap = 50
        self.default_file_dir = 'tmp'

        self.with_retriever: bool = False
        self.prompt_template:str="Context: {context}\nQuestion: {question}\nRéponse:"



    def list_llm(self, ollama_host: str = None) -> List[Dict]:
        ollama_host = ollama_host or self.ollama_host

        try:
            print("[INFO] List modeles...")
            response = requests.get(f"{ollama_host}/api/tags")
            response.raise_for_status() 

            models = response.json().get("models", [])
            print(f"[SUCCESS] Ollama models {models}")
            return models

        except requests.exceptions.RequestException as error:
            print(f"[ERROR] List modeles fetching error : {error}")
            raise Exception(f"List modeles - fetching error : {error}") from error
        
        except Exception as error:
            print(f"[ERROR] List modeles : {error}")
            raise Exception(f"List modeles - Unexpected error: {error}") from error
    

    def install_llm(self, ollama_host: str = None, llm_model_name: str = None) -> Union[List[Dict], Dict]:
        ollama_host = ollama_host or self.ollama_host
        llm_model_name = llm_model_name or self.llm_model_name
    
        try:
            print("[INFO] List modeles...")
            response = requests.get(f"{ollama_host}/api/tags")
            response.raise_for_status()
            
            models = response.json().get("models", [])

            if any(model["name"] == llm_model_name for model in models):
                print(f"[INFO] {llm_model_name} already install")
                return models

            print(f"[INFO] Installation {llm_model_name}...")

            response = requests.post(f"{ollama_host}/api/pull", json={"name": llm_model_name})
            response.raise_for_status()

            model_info = response.text
            print(f"[SUCCESS] Ollama installation of {llm_model_name}  installed successfully:{model_info}")

            return model_info

        except requests.exceptions.RequestException as error:
            print(f"[ERROR] Instalation model fetching error : {error}")
            raise Exception(f"Instalation modeles - fetching error : {error}") from error
        
        except Exception as error:
            print(f"[ERROR] Instalation model : {error}")
            raise Exception(f"Instalation model - Unexpected error: {error}") from error
        
            
    def uninstall_llm(self, ollama_host: str = None, llm_model_name: str = None) -> List[Dict]:
        ollama_host = ollama_host or self.ollama_host
        llm_model_name = llm_model_name or self.llm_model_name
    
        try:
            print(f"[INFO] Remove model {llm_model_name}...")
            response = requests.delete(f"{ollama_host}/api/delete", json={"name": llm_model_name})
            response.raise_for_status()

            print(response)
            print(str(response))

            print(f"[SUCCESS] Modele {llm_model_name} remove")
        
            response = requests.get(f"{ollama_host}/api/tags")
            response.raise_for_status() 

            return response.json().get("models", [])
        
        except requests.exceptions.RequestException as error:
            print(f"[ERROR] Uninstall model fetching error : {error}")
            raise Exception(f"Uninstall modeles - fetching error : {error}") from error
        
        except Exception as error:
            print(f"[ERROR] Uninstall model : {error}")
            raise Exception(f"Uninstall model - Unexpected error: {error}") from error
        

    def list_chats(self)-> List[Dict]:
        try:
            print(f"[INFO] Get chats...")
            return self.chats
        
        except Exception as error:
            print(f"[ERROR] List chats : {error}")
            raise Exception(f"List chats - Unexpected error: {error}") from error
        
    def create_chat(self, name, llm_model_name: str = None, description: str = None, options:dict=None, collection: Optional[str] = None)-> dict:
        llm_model_name = llm_model_name or self.llm_model_name
        options = options or self.default_options

        try : 
            print(f"[INFO] Create chat...")
            chat_id = str(uuid.uuid4())
            new_chat = {
                "id": chat_id,
                "name": name,
                "description": description,
                "collection": collection,
                "chat": {
                    "llm_model_name": llm_model_name,
                    "options": options,
                    "history": [],
                    "stream": False
                }
            }
            self.chats.append(new_chat)
            print(f"[SUCCESS] Chat {new_chat['name']} - {new_chat['chat']}")
            return new_chat
        
        except Exception as error:
            print(f"[ERROR] Create chats : {error}")
            raise Exception(f"Create chats - Unexpected error: {error}") from error
    

    def add_collection_to_chat(self, chat_id: str, collection: str) -> dict:
        try:
            print(f"[INFO] Linking collection '{collection}' to chat '{chat_id}'")

            chat_info = next(({"index": i, "chat": chat} for i, chat in enumerate(self.chats) if chat["id"] == id), None)
            if not chat:
                raise ValueError(f"Chat ID '{chat_id}' not found.")

            collection = next((v for v in self.collections if v["id"] == collection), None)
            if not collection:
                raise ValueError(f"Collection ID '{collection}' not found.")

            chat_info["collection"] = collection

            print(f"[SUCCESS] Collection '{collection}' linked to chat '{chat_info['name']}'")
            return chat_info
        
        except Exception as error:
            print(f"[ERROR] Linking collection to chat: {error}")
            raise Exception(f"Add collection to chat - Unexpected error: {error}") from error
        
        
    def remove_chat(self, id:str) -> List[Dict]:
        try: 
            print(f"[INFO] Remove chat...")

            chat_info = next(({"index": i, "chat": chat} for i, chat in enumerate(self.chats) if chat["id"] == id), None)

            if not chat_info:
                raise Exception(f"No chat found with ID: {id}")

            removed_chat = self.chats.pop(chat_info["index"])
            print(f"[SUCCESS] Chat {removed_chat['id']} ({removed_chat['name']}) removed")
            return  self.chats
        
        except Exception as error:
            print(f"[ERROR] Remove chats : {error}")
            raise Exception(f"Remove chats - Unexpected error: {error}") from error


    def search_chat(self, id:str = None, name:str = None) -> List[Dict]:
        try : 
            print(f"[INFO] Searching chat by id: {id} or name: {name}...")

            normalize = lambda s: "".join(s.lower().split()) if s else None
            normalized_name = normalize(name)

            result = [
                chat for chat in self.chats
                if (id and chat["id"] == id) or (normalized_name and normalize(chat["name"]) == normalized_name)
            ]

            if result:
                print(f"[SUCCESS] Found {len(result)} chat(s): {[chat['name'] for chat in result]}")
            else:
                print("[INFO] No chat found.")

            return result 
        except Exception as error:
            print(f"[ERROR] Search chats : {error}")
            raise Exception(f"Search chats - Unexpected error: {error}") from error
        

    def deep_search_chat(self, partial: Dict[str, Any]) -> List[Dict]:
        try:
            print(f"[INFO] Performing deep search with criteria: {partial}")

            def match(obj: Any, pattern: Any) -> bool:
                if isinstance(pattern, dict):
                    return all(k in obj and match(obj[k], v) for k, v in pattern.items())
                elif isinstance(pattern, list):
                    return all(item in obj for item in pattern)
                else:
                    return obj == pattern  
                
            result = [chat for chat in self.chats if match(chat, partial)]

            if result:
                print(f"[SUCCESS] Found {len(result)} matching chat(s): {[chat['name'] for chat in result]}")
            else:
                print("[INFO] No matching chat found.")

            return result

        except Exception as error:
            print(f"[ERROR] Deepsearch chats : {error}")
            raise Exception(f"Deepsearch chats - Unexpected error: {error}") from error


    def list_options_chat(self, id:str) -> Dict:
        try: 
            print(f"[INFO] List options chat...")

            chat_info = next((chat for chat in self.chats if chat["id"] == id), None)

            if not chat_info:
                raise Exception(f"No chat found with ID: {id}")

            print(f"[SUCCESS] Chat {chat_info['id']} ({chat_info['name']}) found return option")
            return chat_info["chat"].get("options", {})
        
        except Exception as error:
            print(f"[ERROR] List options chats : {error}")
            raise Exception(f"List options chats - Unexpected error: {error}") from error
        

    def update_options_chat(self, id: str, options:Dict) -> Dict:
        try:
            print(f"[INFO] Update options chat...")
            chat_info = next((chat for chat in self.chats if chat["id"] == id), None)

            if not chat_info:
                raise Exception(f"No chat found with ID: {id}")

            chat_info["chat"].setdefault("options", {}).update(options)

            print(f"[SUCCESS] Chat {chat_info['id']} ({chat_info['name']}) updated: {chat_info['chat'].get('options', {})}")

            return chat_info["chat"]
        except Exception as error:
            print(f"[ERROR] Update options chats : {error}")
            raise Exception(f"Update options chats - Unexpected error: {error}") from error    
        


    def generate_response(self, question: str, ollama_host: str = None, llm_model_name: str = None, id: str = None, with_retriever: bool = False, collection: str = None, prompt_template: str = None) -> any:
        
        ollama_host = ollama_host or self.ollama_host
        prompt_template = prompt_template or self.prompt_template

        # Récupérer le chat correspondant à l'ID ou prendre le premier par défaut
        chat = next((c for c in self.chats if c["id"] == id), self.chats[0])
        llm_model_name = llm_model_name or chat["chat"].get("llm_model_name") or self.llm_model_name

        # Logique de gestion du retriever
        if with_retriever is False:
            # Ne pas utiliser le retriever
            retriever = None
        else:
            if collection:
                retriever = next((v["retriever"] for v in self.collections if v["id"] == collection), None)
            else:
                collection_from_chat = chat.get("collection")
                
                if collection_from_chat:
                    retriever = next((v["retriever"] for v in self.collections if v["id"] == collection_from_chat), None)
                else:
                    if self.collections:
                        retriever = self.collections[0].get("retriever", None)
                    else:
                        raise ValueError("No collection found in the system.")

        # Si retriever est défini, obtenir le contexte à partir des documents associés
        if with_retriever:
            docs = retriever.invoke(question)
            formatted_context = "\n\n".join(doc.page_content for doc in docs)
            full_prompt = prompt_template.format(question=question, context=formatted_context)
        else:
            full_prompt = prompt_template.format(question=question, context='')

        messages = chat["chat"]["history"] + [{"role": "user", "content": full_prompt}]

        print(f"Chat : {chat}")
        print(f"Message : {messages}")

        try:
            payload = {
                "model": llm_model_name,
                "messages": messages,
                "stream": chat["chat"].get("stream", False)
            }

            response = requests.post(f"{ollama_host}/api/chat", json=payload)
            response.raise_for_status()
            response_data = response.json()
            message_content = response_data.get("message", {}).get("content", "")


            chat["chat"]["history"].append({"role": "user", "content": question})
            chat["chat"]["history"].append({"role": "assistant", "content": message_content})

            print(f"[SUCCESS] LLM response received")
            print(f"Status Code: {response.status_code}, Response: {response.text}")
            print(f"History : {chat['chat']['history']}")

            return StrOutputParser().parse(message_content)
        except requests.exceptions.RequestException as error:
            print(f"[ERROR] Generate response fetching error : {error}")
            raise Exception(f"Generate response - fetching error : {error}") from error
        
        except Exception as error:
            print(f"[ERROR] Generate response : {error}")
            raise Exception(f"Generate response - Unexpected error: {error}") from error




    def load_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None) -> any:
        try: 
            model_name = model_name or self.model_name
            device = device or self.device
            is_encode_kwargs = is_encode_kwargs or self.is_encode_kwargs

            print(f"[INFO] Loading embedding model: {model_name}")
            start_time = time.time()

            model_kwargs = {"device": device} 
            encode_kwargs = {"normalize_embeddings": is_encode_kwargs}

            embedder = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )

            elapsed_time = time.time() - start_time
            print(f"[SUCCESS] Embedding model loaded in {elapsed_time:.2f}s")
            return embedder
        
        except Exception as error:
            print(f"[ERROR] Load embedder : {error}")
            raise Exception(f"Load embedder - Unexpected error: {error}") from error
       

    def list_embedders(self)-> List[Dict]:
        try:
            print(f"[INFO] List embedders...")
            return self.embedders
        
        except Exception as error:
            print(f"[ERROR] List embedders : {error}")
            raise Exception(f"List embedders - Unexpected error: {error}") from error
        
        
    def search_embedder(self, id:str = None, name:str = None) -> List[Dict]:
        try : 
            print(f"[INFO] Searching embedder by id: {id} or name: {name}...")

            normalize = lambda s: "".join(s.lower().split()) if s else None
            normalized_name = normalize(name)

            result = [
                embedder for embedder in self.embedders
                if (id and embedder["id"] == id) or (normalized_name and normalize(embedder["name"]) == normalized_name)
            ]

            if result:
                print(f"[SUCCESS] Found {len(result)} embedder(s): {[embedder['name'] for embedder in result]}")
            else:
                print("[INFO] No embedder found.")

            return result 
        except Exception as error:
            print(f"[ERROR] Search embedder : {error}")
            raise Exception(f"Search embedder - Unexpected error: {error}") from error

    def create_embedder(self, model_name:str=None, device:str=None, is_encode_kwargs:str=None) -> Dict:
        try : 
            embedder_instance = self.load_embedder(model_name=model_name, device=device, is_encode_kwargs=is_encode_kwargs)
            embedder_id = str(uuid.uuid4())

            embedder_info = {
                "id": embedder_id,
                "name": f"Embedder {model_name}",
                "model_name": model_name,
                "embedder_instance": embedder_instance,
                "device": device or self.device,
                "is_encode_kwargs": is_encode_kwargs or self.is_encode_kwargs
            }

            self.embedders.append(embedder_info)
            return embedder_info  
        except Exception as error:
            print(f"[ERROR] Create embedder : {error}")
            raise Exception(f"Create embedder - Unexpected error: {error}") from error
        

    def remove_embedder(self, id:str) -> List[Dict]:
        try: 
            print(f"[INFO] Remove embedder...")

            embedder_info = next(({"index": i, "embedder": embedder} for i, embedder in enumerate(self.embedders) if embedder["id"] == id), None)

            if not embedder_info:
                raise Exception(f"No embedder found with ID: {id}")

            removed_embedder = self.embedders.pop(embedder_info["index"])
            print(f"[SUCCESS] embedder {removed_embedder['id']} ({removed_embedder['name']}) removed")
            return  self.embedders
        
        except Exception as error:
            print(f"[ERROR] Remove embedders : {error}")
            raise Exception(f"Remove embedders - Unexpected error: {error}") from error
        


    def create_vector_space(self, persist_directory: str = None, collection_name: str = None, embedder:any=None) -> Chroma:
        try: 
            persist_directory = persist_directory or self.persist_directory
            collection_name = collection_name or self.collection_name
            embedder = embedder or self.embedders[0]['embedder_instance']

            print(f"[INFO] Creating empty vector space: {collection_name}")
            start_time = time.time()

            vector_space = Chroma(
                collection_name=collection_name,
                persist_directory=persist_directory,
                embedding_function=embedder
            )

            elapsed_time = time.time() - start_time
            print(f"[SUCCESS] Vector space '{collection_name}' created. {elapsed_time:.2f}s")
            return vector_space
        except Exception as error:
            print(f"[ERROR] Create vector space : {error}")
            raise Exception(f"Create vector space - Unexpected error: {error}") from error
        

    def create_retriever(self, vector_space: Chroma) -> Dict:
        try : 
            print(f"[INFO] Creating retriever for space")
            
            retriever = vector_space.as_retriever()

            print(f"[SUCCESS] Retriever for space created.")
            return retriever
        except Exception as error:
            print(f"[ERROR] Create retriever : {error}")
            raise Exception(f"Create retriever - Unexpected error: {error}") from error
        

    def list_collection(self)-> List[Dict]:
        try:
            print(f"[INFO] List collections...")
            return self.collections
        
        except Exception as error:
            print(f"[ERROR] List collections : {error}")
            raise Exception(f"List collections - Unexpected error: {error}") from error
        
    def save_collection(self, persist_directory: str = None, collection_name: str = None, embedder_id:str=None) -> Dict: 
        try : 
            print(f"[INFO] Save store")
            embedder_info = next(
                ({"index": i, "embedder": embedder} for i, embedder in enumerate(self.embedders) if embedder["id"] == embedder_id),
                None
            )

            embedder = embedder_info["embedder"] if embedder_info else self.embedders[0]
            
            vectorspace = self.create_vector_space(collection_name=collection_name, persist_directory=persist_directory, embedder=embedder["embedder_instance"])
            retriever = self.create_retriever(vectorspace)

            new_store = {
                "id" :  str(uuid.uuid4()),
                "name" : collection_name or self.collection_name,
                "persist_directory": persist_directory or self.persist_directory,  
                "vector_space" : vectorspace,
                "retriever" : retriever, 
                "chunk_size" : self.chunk_size, 
                "chunk_overlap" : self.chunk_overlap, 
                "docs" : [], 
                "embedder" : embedder['id']
            } 

            self.collections.append(new_store)

            print(f"[SUCCESS] Save store")

            return new_store
        except Exception as error:
            print(f"[ERROR] Save store : {error}")
            raise Exception(f"Save store - Unexpected error: {error}") from error
    
    def search_collections(self, id:str = None, name:str = None) -> List[Dict]:
        try : 
            print(f"[INFO] Searching collection by id: {id} or name: {name}...")

            normalize = lambda s: "".join(s.lower().split()) if s else None
            normalized_name = normalize(name)

            result = [
                collection for collection in self.collections
                if (id and collection["id"] == id) or (normalized_name and normalize(collection["name"]) == normalized_name)
            ]

            if result:
                print(f"[SUCCESS] Found {len(result)} collection(s): {[collection['name'] for collection in result]}")
            else:
                print("[INFO] No collection found.")

            return result 
        except Exception as error:
            print(f"[ERROR] Search collection : {error}")
            raise Exception(f"Search collection - Unexpected error: {error}") from error

    def update_collection(self, id: str, updates: Dict) -> List[Dict]:
        try:
            print(f"[INFO] Update collection...")

            collection_info = next(({"index": i, "collection": vs} for i, vs in enumerate(self.collections) if vs["id"] == id),None)

            if not collection_info:
                raise Exception(f"No collection found with ID: {id}")

            for key, value in updates.items():
                if key in collection_info["collection"]:
                    collection_info["collection"][key] = value
                else:
                    print(f"[WARNING] Clé '{key}' non reconnue dans le collection")

            self.collections[collection_info["index"]] = collection_info["collection"]

            print(f"[SUCCESS] collection {id} mis à jour")
            return self.collections

        except Exception as error:
            print(f"[ERROR] Update collection : {error}")
            raise Exception(f"Update collection - Unexpected error: {error}") from error
        

    def remove_collection(self, id:str) -> List[Dict]:
        try: 
            print(f"[INFO] Remove collection...")

            collection_info = next(({"index": i, "collection": collection} for i, collection in enumerate(self.collections) if collection["id"] == id), None)

            if not collection_info:
                raise Exception(f"No collection found with ID: {id}")

            removed_collection = self.collections.pop(collection_info["index"])
            print(f"[SUCCESS] collection {removed_collection['id']} ({removed_collection['name']}) removed")
            return  self.collections
        
        except Exception as error:
            print(f"[ERROR] Remove collections : {error}")
            raise Exception(f"Remove collections - Unexpected error: {error}") from error
        

    def get_docs_from_file(self, file_path: str, supported_extensions:any) -> List[Document]:
        ext = os.path.splitext(file_path)[1].lower()
        if ext in supported_extensions:
            try:
                loader = supported_extensions[ext](file_path)
                return loader.load()
            except Exception as e:
                print(f"[ERROR] Failed to load {file_path}: {e}")
        else:
            print(f"[WARN] Unsupported file format: {file_path}")
        return []
        

    def load_documents(self, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None) -> List[Document]:
        supported_extensions = {
            ".txt": lambda path: TextLoader(path, encoding="utf-8"),
            ".pdf": lambda path: PyPDFLoader(path),
            ".json": lambda path: JSONLoader(path, jq_schema=".content", text_content=False),
        }

        documents = []
        if files:
            for file_path in files:
                if os.path.isfile(file_path):
                    documents += self.get_docs_from_file(file_path, supported_extensions)
                else:
                    print(f"[WARN] File not found: {file_path}")

        if dirs:
            for dir_path in dirs:
                if os.path.isdir(dir_path):
                    for filename in os.listdir(dir_path):
                        file_path = os.path.join(dir_path, filename)
                        if os.path.isfile(file_path):
                            documents += self.get_docs_from_file(file_path, supported_extensions)
                else:
                    print(f"[WARN] Directory not found: {dir_path}")

        if not files and not dirs:
            default_dir = self.default_file_dir
            if os.path.isdir(default_dir):
                for filename in os.listdir(default_dir):
                    file_path = os.path.join(default_dir, filename)
                    if os.path.isfile(file_path):
                        documents += self.get_docs_from_file(file_path, supported_extensions)
            else:
                print(f"[WARN] Default directory not found: {default_dir}")

        print(f"[INFO] Total documents loaded: {len(documents)}")
        return documents

    def chunk_docs(self, documents: List[Document], chunk_size: int = None, chunk_overlap: int = None) -> List[Document]:
        try: 
            chunk_size = chunk_size or self.chunk_size
            chunk_overlap = chunk_overlap or self.chunk_overlap

            print("[INFO] Chunking documents...")
            start_time = time.time()

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap
            )

            chunks = text_splitter.split_documents(documents)

            elapsed_time = time.time() - start_time
            print(f"[SUCCESS] {len(documents)} documents split into {len(chunks)} chunks. {elapsed_time:.2f}s")

            return chunks
        except Exception as error:
            print(f"[ERROR] Chunking documents : {error}")
            raise Exception(f"Chunking documents - Unexpected error: {error}") from error
        

    def add_docs_store(self, store_id: str, dirs: Optional[List[str]] = None, files: Optional[List[str]] = None, chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None) -> Dict:
        try:
            target_store = next((s for s in self.collections if s.get("id") == store_id), None)
            if not target_store:
                raise ValueError(f"Store ID '{store_id}' not found.")

            documents = self.load_documents(dirs=dirs, files=files)

            effective_chunk_size = chunk_size or target_store.get("chunk_size") or self.chunk_size
            effective_chunk_overlap = chunk_overlap or target_store.get("chunk_overlap") or self.chunk_overlap

            chunks = self.chunk_docs(documents, chunk_size=effective_chunk_size, chunk_overlap=effective_chunk_overlap)

            vector_space = target_store["vector_space"]

            print(f"[INFO] Adding {len(chunks)} chunks to collection '{target_store['name']}'")
            start_time = time.time()

            vector_space.add_documents(chunks)

            elapsed = time.time() - start_time
            print(f"[SUCCESS] Documents added to vector store in {elapsed:.2f}s")

            if chunk_size:
                target_store["chunk_size"] = chunk_size
            if chunk_overlap:
                target_store["chunk_overlap"] = chunk_overlap

            paths = {chunk.metadata.get("source") for chunk in chunks if "source" in chunk.metadata}
            target_store["docs"].extend(path for path in paths if path not in target_store["docs"])

            return target_store

        except Exception as e:
            print(f"[ERROR] Add docs to store: {e}")
            raise Exception(f"Add docs to store - Unexpected error: {e}") from e
            


    def remove_docs_store(self, store_id: str) -> Dict:
        try:
            # Recherche du collection par ID
            target_store = next((s for s in self.collections if s.get("id") == store_id), None)
            if not target_store:
                raise ValueError(f"Store ID '{store_id}' not found.")

            vector_space = target_store.get("vector_space")
            if not vector_space:
                raise ValueError("Vector space not initialized for this store.")

            print(f"[INFO] Removing all documents from store '{store_id}'")

            # Suppression de tous les documents dans la collection Chroma
            vector_space._collection.delete(where={})

            # Réinitialisation de la liste des fichiers indexés
            target_store["docs"] = []

            print(f"[SUCCESS] Documents removed from store '{store_id}'")
            return target_store

        except Exception as e:
            print(f"[ERROR] Remove docs from store: {e}")
            raise Exception(f"Remove docs from store - Unexpected error: {e}") from e



