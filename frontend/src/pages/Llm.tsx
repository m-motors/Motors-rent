// src/AdminPage.js
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { current } from "@reduxjs/toolkit";

type  ModelType =  {
	name: string,
	model: string,
	modified_at: Date,
	size: Number,
	digest: string,
	details: {
		parent_model: string,
		format: string,
		family: string,
		families: [
			string
		],
		parameter_size: string,
		quantization_level: string
	}
}

type EmbedderType =  {
	name: string,
	id: string,
	model_name: string,
	embedder_instance: boolean,
	device: string,
	is_encode_kwargs: boolean
}

type VectorstoreType =  {
	name: string,
	id: string,
	persist_directory: string,
	vector_space : boolean, 
	retriever : boolean, 
	chunk_size : number,
	chunk_overlap : number,
	docs : [], 
	embedder : string | EmbedderType | null ,
}

type ChatType =  {
	name: string,
	id: string,
	description: string,
	vectorstore_id: string | VectorstoreType | null,
	chat: {
		history: Message[];
		llm_model_name: string,
		stream: boolean,
		options: {
			num_ctx: number,
			num_gpu: number,
			num_predict: number,
			repeat_last_n: number,
			repeat_penalty: number,
			seed: number,
			stop: [],
			temperature: number,
			top_k: number,
			top_p: number
		},
	}
}


const Llm = () => {
	const host = import.meta.env.VITE_API_HOST;
	const [models, setModels] = useState<ModelType[]>([]);
	const [embedders, setEmbedders] = useState<EmbedderType[]>([]);
	const [vectorestores, setVectorestores] = useState<VectorstoreType[]>([]);
	const [chats, setChats] = useState<ChatType[]>([]);
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);

	const [isModalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<React.ReactNode>(null);

	const displayModal = (content: React.ReactNode) => {
		setModalContent(content);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalContent(null);
	};


	useEffect(() => {
		const fetchAll = async () => {
			await fetchModels();
			await fetchEmbedders();
			await fetchVectorestores();
		};
	
		fetchAll();
	}, []);

	useEffect(() => {
		if (embedders.length === 0) return;
		fetchVectorestores();
	}, [embedders]);
	
	
	useEffect(() => {
		if (vectorestores.length === 0) return;
		fetchChats();
	}, [vectorestores]);


	const fetchModels = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/llm`);
			setModels(prev => [...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayModels = (models: ModelType[]) => (
		<CardList<ModelType>
			items={models}
			getKey={(model, index) => model.name || index}
			onRemove={(event, model) => removeModel(event, model)}
			renderDetails={(model) => (
				<>
					<h4>{model.name}</h4>
					<RecursiveRenderer data={model} />
				</>
			)}
		/>
	);

	const handleSubmitAddModel = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const model = formData.get("model") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/llm`,
				{ 
					llm_model_name: model 
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
			
			fetchModels()
		} catch (error: any) {
			console.error(error)
		}
	}

	const removeModel = async (event:React.MouseEvent<HTMLButtonElement>, model: ModelType) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/llm`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					llm_model_name: model.name
				}
			});
			
			setModels((prev) => prev.filter((mod) => mod.name !== model.name));
		} catch (error: any) {
			console.error(error)
		}
	};


	const fetchEmbedders = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/embedders`);
			setEmbedders([...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayEmbedders = (embedders: EmbedderType[]) => (
		<CardList<EmbedderType>
			items={embedders}
			getKey={(embedder, index) => embedder.id || index}
			onRemove={(event, embedder) => removeEmbedder(event, embedder)}
			renderDetails={(embedder) => (
				<>
					<h4>{embedder.name}</h4>
					<RecursiveRenderer data={embedder} />
				</>
			)}
		/>
	);

	const handleSubmitAddEmbedder = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const model_name = formData.get("modelName") as string;		
		const is_encode_kwargs = formData.get("isEncodeKwargs") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/embedders`,
				{ 
					model_name: model_name,
					is_encode_kwargs: !!is_encode_kwargs
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
			
			setEmbedders((prev) => [...prev, res.data.content[0]]);
		} catch (error: any) {
			console.error(error)
		}
	}
	
	const removeEmbedder 	= async (event:React.MouseEvent<HTMLButtonElement>, embedder: EmbedderType) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/embedders`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					id: embedder.id
				}
			});
			
			setEmbedders((prev) => prev.filter((emb) => emb.id !== embedder.id));
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleSearchEmbedder = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const id = formData.get("embedderId") as string;		
		const name = formData.get("embedderName") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/embedders/search`,
				{ 
					id: id,
					name: name
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			displayModal(displayEmbedders(res.data.content))

		} catch (error: any) {
			console.error(error)
		}
	}

	const fetchVectorestores = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/vectorestores`);
			const vectorestores = res.data.content;

			const enriched = vectorestores.map((vs: VectorstoreType) => ({
				...vs,
				embedder: embedders.find(e => e.id === vs.embedder) || vs.embedder,
			}));
	
			setVectorestores(enriched);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayVectorestores = (vectorestores: VectorstoreType[]) => {
		const sortedVectorestores: VectorstoreType[] =  vectorestores.sort((a, b) => a.name.localeCompare(b.name));

		return (
		<CardList<VectorstoreType>
			items={sortedVectorestores}
			getKey={(vectorestore, index) => vectorestore.id || index}
			onRemove={(event, vectorestore) => removeVectorestore(event, vectorestore)}
			renderDetails={(vectorestore) => (
				<>
					<h4>{vectorestore.name}</h4>
					<RecursiveRenderer data={vectorestore} />
				</>
			)}
		/>
	)};

	const handleSubmitAddVectorestore = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const persist_directory = formData.get("persistDirectory") as string;		
		const collection_name = formData.get("collectionName") as string;		
		const embedder_id = formData.get("embedderId") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/vectorestores`,
				{ 
					persist_directory: persist_directory,
					collection_name: collection_name,
					embedder_id: embedder_id
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
			
			setVectorestores((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const removeVectorestore 	= async (event:React.MouseEvent<HTMLButtonElement>, vectorestore: VectorstoreType) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/vectorestores`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					id: vectorestore.id
				}
			});
			
			setVectorestores((prev) => prev.filter((vec) => vec.id !== vectorestore.id));
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleSearchVectorestore = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const id = formData.get("vectorestoreId") as string;		
		const name = formData.get("vectorestoreName") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/vectorestores/search`,
				{ 
					id: id,
					name: name
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			displayModal(displayVectorestores(res.data.content))
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleSubmitAddRetriver = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const store_id = formData.get("storeId") as string;		
		const dirs = formData.get("dirs") as string;		
		const files = formData.get("files") as string;		
		const chunk_size = formData.get("chunkSize") as string;		
		const chunk_overlap = formData.get("chunkOverlap") as string;	

		try {
			const res = await axios.post(`${host}/api/rag/retriver`,
				{ 	
					store_id:store_id
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
			
			const updatedVectorstore = res.data.content;
			setVectorestores((prev) =>
				prev.map((vs) =>
					vs.id === updatedVectorstore.id ? { ...vs, ...updatedVectorstore } : vs
				)
			)
		} catch (error: any) {
			console.error(error)
		}
	}

	const fetchChats = async () => {

		console.log(vectorestores)

		try {
			const res: any = await axios.get(`${host}/api/rag/chats`);
			const chats = res.data.content;

			const enriched = chats.map((chat: ChatType) => ({
				...chat,
				vectorstore_id: vectorestores.find(vs => vs.id === chat.vectorstore_id) || chat.vectorstore_id,
			}));

			setChats(enriched);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayChats = (chats: ChatType[]) => {

		const sortedChats: ChatType[] =  chats.sort((a, b) => a.name.localeCompare(b.name));

		return (
			<CardList<ChatType>
				items={sortedChats}
				getKey={(chat, index) => chat.name || index}
				onRemove={(event, chat) => removeChat(event, chat)}
				onSelect={(event, chat) => handleChangeCurrentChat(event, chat)}
				renderDetails={(chat) => (
					<>
						<h4>{chat.name}</h4>
						<RecursiveRenderer data={chat} />
					</>
				)}
			/>
		)
	};

	const removeChat = async (event:React.MouseEvent<HTMLButtonElement>, chat: ChatType) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/chats`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					id: chat.id
				}
			});
			
			setChats((prev) => prev.filter((cha) => cha.id !== chat.id));
		} catch (error: any) {
			console.error(error)
		}
	};

	const handleSubmitAddChat = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const name = formData.get("chatName") as string;		
		const llm_model_name = formData.get("llmModelName") as string;		
		const description = formData.get("description") as string;		
		const options = formData.get("options") as string;		
		const vectorstore_id = formData.get("vectorstoreId") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/chats`,
				{ 
					name: name,
					description: description,
					llm_model_name: llm_model_name,
					options: options,
					vectorstore_id: vectorstore_id 
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
			
			setChats((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleGenerateResponse = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const question = formData.get("prompt") as string;
	
		if (!currentChatId || !question.trim()) return;
	
		try {
			const res = await axios.post(`${host}/api/rag`, {
				question: question,
				id: currentChatId,
				vectorstore_id: chats.find((chat) => chat.id === currentChatId)?.vectorstore_id
			}, {
				headers: {
					"Content-Type": "application/json",
				},
			});
	
			const response  = res.data.content;

			setChats(prevChats =>
				prevChats.map(chat => {
					if (chat.id !== currentChatId) return chat;
	
					return {
						...chat,
						chat: {
							...chat.chat,
							history: [
								...chat.chat.history,
								{ role: "user", content: question },
								{ role: "assistant", content: response }
							]
						}
					};
				})
			);

			event.currentTarget.reset();
	
		} catch (error) {
			console.error(error);
		}
	};
	
	const handleChangeCurrentChat = (
		event?: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLElement>,
		chat?: ChatType
	) => {
		let selectedId: string | undefined;
	
		if ('target' in (event || {}) && (event?.target as HTMLSelectElement).value) {
			selectedId = (event?.target as HTMLSelectElement).value;
		} else if (chat?.id) {
			selectedId = chat.id;
		}
	
		if (!selectedId) return;
		setCurrentChatId(selectedId);
	};

  return (
    <div className="h-full" >
        <Header />

				{isModalOpen && (
					<Modal isOpen={isModalOpen} onClose={closeModal}>
						{
							modalContent
						}
					</Modal>
				)}

				<div className="min-h-screen bg-gray-900 p-6 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<aside>
						<section>
							<h4 className="text-2xl font-bold dark:text-white mb-4 mt-8">Conversations</h4>
							{
								displayChats(chats)
							}
						</section>
					</aside>

					<main className="flex flex-col h-screen overflow-hidden p-2 space-y-4 px-4">
						<div >
							<label  htmlFor="chatId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chat *</label>
							<select
								id="chatId"
								name="chatId"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								title="string"
								onChange={event => handleChangeCurrentChat(event)}
							>
								<option value="">Sélectionnez un chat</option>
								{chats.map((chat) => (
									<option key={chat.id} value={chat.id} selected={chat.id === currentChatId}>
										{chat.name}
									</option>
								))}
							</select>
						</div>
							
						
						{currentChatId && (
							<div className="flex-1 overflow-y-auto px-2">
								<ChatHistory
									history={chats.find((chat) => chat.id === currentChatId)?.chat.history || []}
								/>
							</div>
						)}

						<div>
							<form onSubmit={event => handleGenerateResponse(event)}>
								<div>
									<label  htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prompt *</label>
									<textarea id="prompt" name="prompt" placeholder="Votre question ..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>
								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Envoyer</button>
							</form>
						</div>
					</main>

					<aside>
						<section>
							<h3 className="text-3xl font-bold dark:text-white mb-4 mt-8">Models</h3>
							<form onSubmit={event => handleSubmitAddModel(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="modelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom *</label>
									<input id="modelName" type="text" name="modelName" placeholder="Nom du model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
									<div>
										<p>
											Nom du model trouvé sur : <a href="https://ollama.com/search">Ollama</a>
										</p>
										<p>
											Conseiller : <span>mistral:7b</span> ou <span>llama2:7b</span>
										</p>
									</div>
								</div>
								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Ajouter le model</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

							{
								displayModels(models)
							}
						</section>

						<section>
							<h3 className="text-3xl font-bold dark:text-white mb-4 mt-8">Embedders</h3>
							<form onSubmit={event => handleSubmitAddEmbedder(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="modelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du model</label>
									<input id="modelName" type="text" name="modelName" placeholder="Nom du model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
									<p>
										Conseiller : <span>all-MiniLM-L6-v2</span>
									</p>
								</div>
								<div>
									<label  htmlFor="isEncodeKwargs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Encode kwargs</label>
									<input id="isEncodeKwargs" type="text" name="isEncodeKwargs" placeholder="Encode kwargs" title='boolean' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Ajouter le embedder</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

							<form onSubmit={event => handleSearchEmbedder(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="embedderId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de l'embedder</label>
									<input id="embedderId" type="text" name="embedderId" placeholder="Id de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<div>
									<label  htmlFor="embedderName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de l'embedder</label>
									<input id="embedderName" type="text" name="embedderName" placeholder="Nom de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Rechercher l'embedder</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
						
							{
								displayEmbedders(embedders)
							}
						</section>

						<section>
							<h3 className="text-3xl font-bold dark:text-white mb-4 mt-8">Vectorestore</h3>
							
							<form onSubmit={event => handleSubmitAddVectorestore(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="persistDirectory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repertoire persisté</label>
									<input id="persistDirectory" type="text" name="persistDirectory" placeholder="Repertoire persisté" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>

									<label  htmlFor="collectionName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la collection</label>
									<input id="collectionName" type="text" name="collectionName" placeholder="Nom de la collection" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>

									<label  htmlFor="embedderId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de l'embdder</label>
									<input id="embedderId" type="text" name="embedderId" placeholder="Id de l'embdder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>

								</div>
								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Creer le vectorstore</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

							<form onSubmit={event => handleSearchVectorestore(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="embedderId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de l'embedder</label>
									<input id="embedderId" type="text" name="embedderId" placeholder="Id de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<div>
									<label  htmlFor="vectorestoreName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du vectorestore</label>
									<input id="vectorestoreName" type="text" name="vectorestoreName" placeholder="Nom du vectorestore" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Rechercher le vectorestore</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

							<form onSubmit={event => handleSubmitAddRetriver(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="storeId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Store Id *</label>

									<select
										id="storeId"
										name="storeId"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										title="Sélectionnez un Vectorstore"
										required
									>
										<option value="">Sélectionnez un Vectorstore</option>
										{vectorestores.map((store) => (
											<option key={store.id} value={store.id}>
												{store.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label  htmlFor="dirs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du repertoire</label>
									<input id="dirs" type="text" name="dirs" placeholder="Nom du repertoire" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Ajouter le model</button>
							</form>

							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
						
							{
								displayVectorestores(vectorestores)
							}
						</section>

						<section>
							<h3 className="text-3xl font-bold dark:text-white mb-4 mt-8">Chats</h3>

							<form onSubmit={event => handleSubmitAddChat(event)} className="max-w-sm mx-auto">
								<div>
									<label  htmlFor="chatName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom *</label>
									<input id="chatName" type="text" name="chatName" placeholder="Chat par defaut" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<div>
									<label  htmlFor="llmModelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du model LLM</label>
									<input id="llmModelName" type="text" name="llmModelName" placeholder="mistral:7b" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<div>
									<label  htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
									<textarea id="description" name="description" placeholder="Description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<div>
									<label  htmlFor="options" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Options</label>
									<input disabled id="options" type="text" name="options" placeholder="..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<div>
									<label  htmlFor="vectorstoreId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de la collection</label>
									<input id="vectorstoreId" type="text" name="vectorstoreId" placeholder="11111111-1111-1111-1111-111111111111" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
								</div>
								<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Ajouter le chat</button>
							</form>
						</section>
					</aside>
        </div>
        <Footer />
    </div>
  );
};

export default Llm;


type CardListProps<T> = {
	items: T[];
	renderDetails: (item: T) => React.ReactNode;
	getKey: (item: T, index: number) => string | number;
	onRemove?: (event: React.MouseEvent<HTMLButtonElement>, item: T) => void;
	removeLabel?: string;
	onSelect?: (event: React.MouseEvent<HTMLButtonElement>, item: T) => void;
	selectLabel?: string;
};

const CardList = <T,>({
	items,
	renderDetails,
	getKey,
	onRemove,
	onSelect,
	removeLabel = "Remove",
	selectLabel = "Selectionner"
}: CardListProps<T>) => {
	return (
		<ul className="flex flex-col gap-10">
			{items.map((item, index) => (
				<li key={getKey(item, index)} className="max-w-full">
					<div className="w-full max-w-sm overflow-hidden text-ellipsis break-words p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
						{renderDetails(item)}
						{onSelect && (
							<button
								className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
								onClick={(event) => onSelect(event, item)}
							>
								{selectLabel}
							</button>
						)}
						{onRemove && (
							<button
								className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
								onClick={(event) => onRemove(event, item)}
							>
								{removeLabel}
							</button>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

type RecursiveRendererProps = {
	data: any;
	level?: number;
	parentKey?: string;
};

const RecursiveRenderer = ({ data, level = 0, parentKey = "" }: RecursiveRendererProps) => {
	if (data === null || data === undefined) return <span>null</span>;

	if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
		return <span>{data.toString()}</span>;
	}

	if (Array.isArray(data)) {
		return (
			<ul style={{ marginLeft: level * 10 }}>
				{data.map((item, index) => (
					<li key={index}>
						<RecursiveRenderer data={item} level={level + 1} />
					</li>
				))}
			</ul>
		);
	}

  if (typeof data === "object") {
    if (level === 0) {
      return (
        <ul style={{ marginLeft: level * 10 }}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              {typeof value === "object" && value !== null ? (
                <RecursiveRenderer data={value} level={level + 1} parentKey={key} />
              ) : (
                <>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong> {value?.toString()}
                </>
              )}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul style={{ marginLeft: level * 10 }}>
        <li>
          <details open={level === 0}>
            <summary>{parentKey || "Object"}</summary>
            <ul>
              {Object.entries(data).map(([key, value]) => (
                <li key={key}>
                  {typeof value === "object" && value !== null ? (
                    <RecursiveRenderer data={value} level={level + 1} parentKey={key} />
                  ) : (
                    <>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong> {value?.toString()}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </li>
      </ul>
    );
  }

  return <span>Unsupported type</span>;
};


type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-white">
			<div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-6">
				<button
					onClick={onClose}
					className="absolute top-0 right-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl"
				>
					&times;
				</button>
				<div className="flex flex-row flex-wrap justify-center gap-4">
					{children}
				</div>
			</div>
		</div>
	);
};

type Message = {
	role: 'user' | 'assistant';
	content: string;
};

type ChatHistoryProps = {
	history: Message[];
};

const ChatHistory = ({ history }: ChatHistoryProps) => {
	return (
		<div className="space-y-4">
			{history.map((msg, index) => (
				<div
					key={index}
					className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
				>
					<div
						className={`max-w-[320px] p-4 rounded-xl shadow-sm text-sm leading-5 ${
							msg.role === 'user'
								? 'bg-blue-600 text-white rounded-br-none'
								: 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'
						}`}
					>
						{msg.content}
					</div>
				</div>
			))}
		</div>
	);
};