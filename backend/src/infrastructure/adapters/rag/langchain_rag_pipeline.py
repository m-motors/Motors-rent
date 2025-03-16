import time
import json
import uuid
import requests
from ollama import chat
from langchain_community.llms import Ollama
from typing import List, Optional
from langchain.prompts import PromptTemplate
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

from src.application.ports.output.rag_pipeline import RAGPipeline
from src.domain.models.document_rag import DocumentRAG, DocumentRAGStatus


class LangcahinRAGPipeline(RAGPipeline):
    def __init__(self):
        self.retriever: any
        self.prompt_template: any
        self.model_name="sentence-transformers/all-MiniLM-L6-v2"
        self.model_kwargs="cpu"
        self.encode_kwargs= True
        self.llm_model_name="mistral:7b"  # Alternative :  'llama2:7b
        self.ollama_host = "http://ollama:11434"
        self.chats = {}

    def list_llm(self, ollama_host=None) -> List:
        ollama_host = ollama_host if ollama_host is not None else self.ollama_host 
    
        try:
            print("[INFO] List modeles...")
            response = requests.get(f"{ollama_host}/api/tags")
            
            if response.status_code == 200:
                models = response.json().get("models", [])
                print(f"[SUCCESS] Ollama models {models}")
                return models
            else:
                raise Exception(f"Ollama list failed: {response.status_code} - {response.text}")
            
        except Exception as e:
            print(f"[ERROR] List modeles : {e}")
            raise e
        

    def install_llm(self, ollama_host=None, llm_model_name=None) -> List | dict :
        ollama_host = ollama_host if ollama_host is not None else self.ollama_host 
        llm_model_name = llm_model_name if llm_model_name is not None else self.llm_model_name 
    
        try:
            print("[INFO] List modeles...")
            response = requests.get(f"{ollama_host}/api/tags")
            
            models = response.json().get("models", [])

            if any(model["name"] == llm_model_name for model in models):
                print(f"[INFO] {llm_model_name} was install")
                print(models)
                return models

            print(f"[INFO] Installation {llm_model_name}...")
            response = requests.post(f"{ollama_host}/api/pull", json={"name": llm_model_name})

            print(f"[SUCCESS] Ollama installation of {llm_model_name} returned:")
            print(f"Status Code: {response.status_code}, Response: {response.text}")

            if response.status_code == 200:
                return response
            else:
                raise Exception(f"Ollama installation failed: {response.status_code} - {response.text}")
        
        except Exception as e:
            print(f"[ERROR] Instalation model failed : {e}")
            raise e 
        

    def uninstall_llm(self, ollama_host=None, llm_model_name=None)-> dict:
        ollama_host = ollama_host if ollama_host is not None else self.ollama_host 
        llm_model_name = llm_model_name if llm_model_name is not None else self.llm_model_name 

        try:
            print(f"[INFO] Remove model {llm_model_name}...")
            response = requests.delete(f"{ollama_host}/api/delete", json={"name": llm_model_name})

            if response.status_code == 200:
                print(f"[SUCCESS] Modele {llm_model_name} remove")
                return True
            else:
                raise Exception(f"Ollama remove failed: {response.status_code} - {response.text}")
        
        except Exception as e:
            print(f"[ERROR] Remove model failed : {e}")
            raise e
        

    def create_chat(self, name, llm_model_name=None, description='', options={})-> dict:
        llm_model_name = llm_model_name if llm_model_name is not None else self.llm_model_name 
    
        try : 
            print(f"[INFO] Create chat...")
            chat_id = str(uuid.uuid4())
            new_chat = {
                "id": chat_id,
                "name": name,
                "description": description,
                "chat": {
                    "llm_model_name": llm_model_name,
                    "options": options,
                    "history": [],
                    "stream": False
                }
            }
            self.chats.append(new_chat)
            print(f"[SUCCESS] Chat '{name}' create {json.dumps(new_chat)}")
            return new_chat
        except Exception as e:
            print(f"[ERROR] Create chat failed : {e}")
            raise e

    def list_chats(self)-> List:
        try :
            print(f"[INFO] List chats...")
            return [{"id": chat["id"], "name": chat["name"], "description": chat["description"]} for chat in self.chats]
        except Exception as e:
            print(f"[ERROR] List chats failed : {e}")
            raise e
        
    def search_chat(self, identifier) -> dict:
        try : 
            print(f"[INFO] Search chat...")
            for index, chat in enumerate(self.chats):
                if chat["id"] == identifier or chat["name"] == identifier:
                    print(f"[SUCCESS] Chat {index} {chat['id']} {chat['name']} found")
                    return {'index': index, 'chat': chat}
            raise Exception(f"No chat found with: {identifier}")
        except Exception as e:
            print(f"[ERROR] Search chat failed : {e}")
            raise e

    def remove_chat(self, identifier) -> bool:
        try: 
            print(f"[INFO] Remove chat...")
            chat_info = self.search_chat(identifier)
            index = chat_info["index"]

            removed_chat = self.chats.pop(index) 
            print(f"[SUCCESS] Chat {removed_chat['id']} ({removed_chat['name']}) removed")
            return True
        except Exception as e:
            print(f"[ERROR] Remove chat failed : {e}")
            raise e
        
    def list_chat_options(self, identifier)-> dict:
        try:
            print(f"[INFO] Get parameters...")
            chat_info = self.search_chat(identifier)
            chat = chat_info["chat"]

            print(f"[SUCCESS] Model parameters for chat {chat['id']} ({chat['name']}) :\n{chat.get('options', {})}")
            return chat.get("options", {})
        except Exception as e:
            print(f"[ERROR] Get chat parameters failed: {e}")
            raise e


    def set_chat_options(self, identifier, options=None) -> dict:
        try:
            chat_info = self.search_chat(identifier)
            chat = chat_info["chat"]

            if options is not None:
                if "options" not in chat:
                    chat["options"] = {}
                chat["options"].update(options)

            print(f"[SUCCESS] Chat {chat['id']} ({chat_info['name']}) updated :\n{chat.get('options', {})}")
            return chat.get("options", {})

        except Exception as e:
            print(f"[ERROR] Set chat parameters failed: {e}")
            raise e


    


        
        
    def generate_response(self, question, ollama_host=None, llm_model_name=None, withContext = False, retriever=None, prompt_template=None) -> any:
        ollama_host = ollama_host if ollama_host is not None else self.ollama_host 
        llm_model_name = llm_model_name if llm_model_name is not None else self.llm_model_name 

        if (withContext): 
            retriever = retriever if retriever is not None else self.retriever
            prompt_template = prompt_template if prompt_template is not None else self.prompt_template

            docs = retriever.invoke(question)
            formatted_context = "\n\n".join(doc.page_content for doc in docs)

            # Build prompt
            full_prompt = prompt_template.format(question=question, context=formatted_context)

        # Execution
        full_prompt = question

        print("[INFO] Generating response...")
        start_time = time.time()
        try : 
            # Envoi de la requête à Ollama
            payload = {
                "model": llm_model_name,
                "messages": [{"role": "user", "content": full_prompt}],
                "stream": False
            }

            response = requests.post(f"{ollama_host}/api/chat", json=payload)

            print(f"[SUCCESS] llm response")
            print(f"Status Code: {response.status_code}, Response: {response.text}")
            elapsed_time = time.time() - start_time
            print(f"[SUCCESS] Réponse générée en {elapsed_time:.2f}s")
            
            if response.status_code == 200:
                return StrOutputParser().parse(response.json()["message"]["content"])
            else:
                raise Exception(f"Ollama installation failed: {response.status_code} - {response.text}")
        

        except Exception as e:
            print(f"[ERROR] Erreur lors de la génération de réponse : {e}")
            return {"status": "error", "message": str(e)}


        
    
    # def load_embedding_model(self, model_name=None) -> any:
    #   model_name = model_name if model_name is not None else self.model_name 
    #   print(f"[INFO] Loading embedding model: {model_name}")
    #   start_time = time.time()
    #   model_kwargs = {"device": self.model_kwargs}
    #   encode_kwargs = {"normalize_embeddings": self.encode_kwargs}
    #   embeddings = HuggingFaceEmbeddings(
    #       model_name=model_name, model_kwargs=model_kwargs, encode_kwargs=encode_kwargs
    #   )
    #   elapsed_time = time.time() - start_time
    #   print(f"[SUCCESS] Embedding model loaded in {elapsed_time:.2f}s")
    #   return embeddings
    
    
    # def load_document(self, file_path: str) -> any:
    #     print(f"[INFO] Loading document from {file_path}")
    #     start_time = time.time()
    #     with open(file_path, 'r', encoding='utf-8') as file:
    #         content = file.read()
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] Document loaded. Length: {len(content)} characters. {elapsed_time:.2f}s")
    #     return content
    
    # def chunk_text(self, doc_content: str, chunk_size: int, chunk_overlap: int)  -> any:

    #     print("[INFO] Chunking document...")
    #     start_time = time.time()
    #     docs = [Document(page_content=doc_content)]
    #     text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    #     chunks = text_splitter.split_documents(docs)
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] Document split into {len(chunks)} chunks. {elapsed_time:.2f}s")
    #     return chunks
    
    # def create_vectorstore_indexing_chunks(self, chunks: List, embeddings: any, persist_directory: str) -> any:
    #     print("[INFO] Storing embeddings in ChromaDB")
    #     start_time = time.time()
    #     vectorstore = Chroma.from_documents(chunks, embedding=embeddings, persist_directory=persist_directory)
    #     vectorstore.persist()
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] Documents stored in ChromaDB. {elapsed_time:.2f}s")
    #     return vectorstore
        
    # def create_retriever(self, vectorstore: str) -> any:
    #     return vectorstore.as_retriever()
    
    # def define_prompt_template(self) -> any:
    #     print("[INFO] Defining prompt template...")
    #     start_time = time.time()
    #     prompt_template = PromptTemplate(
    #         template="Context:\n{context}\n\nQuestion: {question}\nAnswer:",
    #         input_variables=["context", "question"]
    #     )
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] Prompt template generated. {elapsed_time:.2f}s")
    #     return prompt_template
    
    # def startRag(self) -> any:
    #     print("\n#### STEP 1: Setup ####")
    #     start_time = time.time()
    #     embedding_model = self.load_embedding_model()
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] {elapsed_time:.2f}s")

    #     print("\n#### STEP 2: Pre-Indexing ####")
    #     start_time = time.time()
    #     doc_content = self.load_document('./assets/ressources/base.txt')
    #     chunks = self.chunk_text(doc_content)
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] {elapsed_time:.2f}s")

    #     print("\n#### STEP 3: Indexing ####")
    #     start_time = time.time()
    #     vectorstore = self.create_vectorstore_indexing_chunks(chunks, embedding_model)
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] {elapsed_time:.2f}s")

    #     print("\n#### STEP 4: Retrieval ####")
    #     start_time = time.time()
    #     self.retriever = self.create_retriever(vectorstore)
    #     self.prompt_template = self.define_prompt_template()
    #     elapsed_time = time.time() - start_time
    #     print(f"[SUCCESS] {elapsed_time:.2f}s")
    