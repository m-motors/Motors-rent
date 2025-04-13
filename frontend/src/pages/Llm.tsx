import { useEffect, useState } from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Guide from "../components/llm/Guide";
import Modal from "../components/llm/Modal";
import Chats from "../components/llm/Chats";
import Models from "../components/llm/Models";
import CardList from "../components/llm/CardList";
import AsideTabs from "../components/llm/AsideTabs";
import Embedders from "../components/llm/Embedders";
import Collections from "../components/llm/Collection";
import RecursiveRenderer from "../components/llm/RecursiveRenderer";
import ChatHistory, { Message } from "../components/llm/ChatHistory";

import '../styles/llm.css'
import { useApi } from "../hooks/useApi";

export type ModelType =  {
	name: string,
	model: string,
	size: Number,
	digest: string,
	modified_at: Date,
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

export type EmbedderType =  {
	name: string,
	id: string,
	model_name: string,
	embedder_instance: boolean,
	device: string,
	is_encode_kwargs: boolean
}

export type CollectionType =  {
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

export type ChatType =  {
	name: string,
	id: string,
	description: string,
	collection: string | CollectionType | null,
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
	const [collections, setCollections] = useState<CollectionType[]>([]);
	const [chats, setChats] = useState<ChatType[]>([]);
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);

	const [isModalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<React.ReactNode>(null);

	const api = useApi();  
	

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
			await fetchCollections();
		};
	
		fetchAll();
	}, []);

	useEffect(() => {
		if (embedders.length === 0) return;
		fetchCollections();
	}, [embedders]);
	
	
	useEffect(() => {
		if (collections.length === 0) return;
		fetchChats();
	}, [collections]);


	const fetchModels = async () => {
		try {
			const res: any = await api.get(`/api/rag/llm`);
			setModels(() => [...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayModels = (models: ModelType[]) => {
		const sortedmodels = [...models].sort((a, b) => a.name.localeCompare(b.name));

		return (
			<CardList<ModelType>
				items={sortedmodels}
				getKey={(model: ModelType, index: number) => model.name || index}
				onRemove={(event: React.MouseEvent<HTMLButtonElement>, model: ModelType) => removeModel(event, model)}
				renderDetails={(model: ModelType) => (
					<>
						<h5 className="text-xl font-bold dark:text-white mb-2">{model.name.charAt(0).toUpperCase() + model.name.slice(1)}</h5>
						<RecursiveRenderer data={model} keyOrder={["name", "model", "size"]}/>
					</>
				)}
			/>
		);
}

	const handleSubmitAddModel = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const model = formData.get("modelName") as string

		try {
			await api.post(`/api/rag/llm`,
				{ 
					llm_model_name: model 
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
			await api.delete(`/api/rag/llm`, {
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
			const res: any = await api.get(`/api/rag/embedders`);
			setEmbedders([...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayEmbedders = (embedders: EmbedderType[]) => {
		const sortedembedders = [...embedders].sort((a, b) => a.name.localeCompare(b.name));

		return (
			<CardList<EmbedderType>
				items={sortedembedders}
				getKey={(embedder: EmbedderType, index: number) => embedder.id || index}
				onRemove={(event: React.MouseEvent<HTMLButtonElement>, embedder: EmbedderType) => removeEmbedder(event, embedder)}
				renderDetails={(embedder:EmbedderType) => (
					<>
						<h5 className="text-xl font-bold dark:text-white mb-2">{embedder.name.charAt(0).toUpperCase() + embedder.name.slice(1)}</h5>
						<RecursiveRenderer data={embedder} keyOrder={["name", "model", "size"]}/>
					</>
				)}
			/>
		)
	}

	const handleSubmitAddEmbedder = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const model_name = formData.get("modelName") as string;		
		const is_encode_kwargs = formData.get("isEncodeKwargs") as string;		

		try {
			const res = await api.post(`/api/rag/embedders`,
				{ 
					model_name: model_name,
					is_encode_kwargs: !!is_encode_kwargs
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
			await api.delete(`/api/rag/embedders`, {
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
			const res = await api.post(`/api/rag/embedders/search`,
				{ 
					id: id,
					name: name
				},
			);

			displayModal(displayEmbedders(res.data.content))

		} catch (error: any) {
			console.error(error)
		}
	}

	const fetchCollections = async () => {
		try {
			const res: any = await api.get(`/api/rag/collections`);
			const collections = res.data.content;

			const enriched = collections.map((vs: CollectionType) => ({
				...vs,
				embedder: embedders.find(e => e.id === vs.embedder) || vs.embedder,
			}));
	
			setCollections(enriched);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayCollections = (collections: CollectionType[]) => {
		const sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));

		return (
		<CardList<CollectionType>
			items={sortedCollections}
			getKey={(collection : CollectionType, index: number) => collection.id || index}
			onRemove={(event: React.MouseEvent<HTMLButtonElement>, collection: CollectionType) => removeCollection(event, collection)}
			renderDetails={(collection: CollectionType) => (
				<>
					<h5 className="text-xl font-bold dark:text-white mb-2">{collection.name.charAt(0).toUpperCase() + collection.name.slice(1)}</h5>
					<RecursiveRenderer data={collection} keyOrder={["name", "id", "persist_directory", "vector_space", "docs", "embedder"]}/>
				</>
			)}
		/>
	)};

	const handleSubmitAddCollection = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const persist_directory = formData.get("persistDirectory") as string;		
		const collection_name = formData.get("collectionName") as string;		
		const embedder_id = formData.get("embedderId") as string;		

		try {
			const res = await api.post(`/api/rag/collections`,
				{ 
					persist_directory: persist_directory,
					collection_name: collection_name,
					embedder_id: embedder_id
				}
			);

			res.data.content.embedder =  embedders.find(e => e.id === res.data.content.embedder)
			
			setCollections((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const removeCollection 	= async (event:React.MouseEvent<HTMLButtonElement>, collection: CollectionType) => {
		event.preventDefault()
		try {
			await api.delete(`/api/rag/collections`, {
				data: {
					id: collection.id
				}
			});
			
			setCollections((prev) => prev.filter((vec) => vec.id !== collection.id));
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleSearchCollection = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const id = formData.get("collectionId") as string;		
		const name = formData.get("collectionName") as string;		

		try {
			const res = await api.post(`/api/rag/collections/search`,
				{ 
					id: id,
					name: name
				}
			);

			displayModal(displayCollections(res.data.content))
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleSubmitAddRetriver = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget);
		const store_id = formData.get("storeId") as string;		
		// const dirs = formData.get("dirs") as string;		
		// const files = formData.get("files") as string;		
		// const chunk_size = formData.get("chunkSize") as string;		
		// const chunk_overlap = formData.get("chunkOverlap") as string;	

		try {
			const res = await api.post(`/api/rag/retriver`,
				{ 	
					store_id:store_id
				}
			);

			res.data.content.embedder =  embedders.find(e => e.id === res.data.content.embedder)
			const updatedCollection = res.data.content;
			setCollections((prev) =>
				prev.map((vs) =>
					vs.id === updatedCollection.id ? { ...vs, ...updatedCollection } : vs
				)
			)
		} catch (error: any) {
			console.error(error)
		}
	}

	const fetchChats = async () => {
		try {
			const res: any = await api.get(`/api/rag/chats`);
			const chats = res.data.content;

			const enriched = chats.map((chat: ChatType) => ({
				...chat,
				collection: collections.find(vs => vs.id === chat.collection) || chat.collection,
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
				getKey={(chat: ChatType, index: number) => chat.name || index}
				onRemove={(event: React.MouseEvent<HTMLButtonElement>, chat:ChatType) => removeChat(event, chat)}
				onSelect={(event: React.MouseEvent<HTMLButtonElement>, chat : ChatType) => handleChangeCurrentChat(event, chat)}
				renderDetails={(chat: ChatType) => (
					<>
						<h5 className="text-xl font-bold dark:text-white mb-2">{chat.name.charAt(0).toUpperCase() + chat.name.slice(1)}</h5>
						<RecursiveRenderer data={chat} keyOrder={["name", "id", "persist_directory", "vector_space", "docs", "embedder"]}/>
					</>
				)}
			/>
		)
	};

	const removeChat = async (event:React.MouseEvent<HTMLButtonElement>, chat: ChatType) => {
		event.preventDefault()
		try {
			await api.delete(`/api/rag/chats`, {
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
		const collection = formData.get("collectionId") as string;		

		try {
			const res = await api.post(`/api/rag/chats`,
				{ 
					name: name,
					description: description,
					llm_model_name: llm_model_name,
					options: options,
					collection: collection 
				}
			);

			res.data.content.collection =  collections.find(e => e.id === res.data.content.collection)
			
			setChats((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const handleGenerateResponse = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const question = formData.get("prompt") as string;
	
		if (!currentChatId || !question.trim()) return;

		const currentCollection = chats.find((chat) => chat.id === currentChatId)?.collection
		const currentCollectionId = typeof currentCollection === "string" ? currentCollection : currentCollection?.id;

		if (!currentCollectionId) {
			console.error("Aucune collection associée à la discussion actuelle.");
			return;
		}
	
		try {
			const res = await api.post(`${host}/api/rag`, {
				question: question,
				id: currentChatId,
				collection: currentCollectionId
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

			form.reset();
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

	const sections = [
		{ 
			name: "Guide", 
			node: <Guide />
		},
		{ 
			name: "Models", 
			node: <Models onSubmit={handleSubmitAddModel} renderList={() => displayModels(models)} /> 
		},
		{ 
			name: "Embedders", 
			node: <Embedders onSubmit={handleSubmitAddEmbedder} renderList={() => displayEmbedders(embedders)} moreActions={[handleSearchEmbedder]}/>
		},
		{ 
			name: "Collections", 
			node: <Collections collections={collections} onSubmit={handleSubmitAddCollection} renderList={()=>displayCollections(collections)} moreActions={[handleSearchCollection, handleSubmitAddRetriver]}/> 
		},
		{ 
			name: "Chats", 
			node: <Chats models={models} collections={collections} onSubmit={handleSubmitAddChat} renderList={()=>displayChats(chats)}/>
		},
	];

  return (
    <div className="scrollbar-custom">
        <Header />

				{isModalOpen && (
					<Modal isOpen={isModalOpen} onClose={closeModal}>
						{
							modalContent
						}
					</Modal>
				)}

				<div style={{ height: "calc(100vh - 64px - 112px)", gridTemplateColumns: 'auto 1fr 1.5fr'}} className="bg-gray-900 px-6 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<aside  className="p-4 h-full flex flex-col overflow-hidden">
						<div >
							<label  htmlFor="chatId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chat *</label>
							<select
								id="chatId"
								name="chatId"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								title="string"
								onChange={event => handleChangeCurrentChat(event)}
								value={currentChatId ?? ""}
							>
								<option value="">Sélectionnez un chat</option>
								{chats.map((chat) => (
									<option key={chat.id} value={chat.id}>
										{chat.name}
									</option>
								))}
							</select>
						</div>
						<section  className="flex flex-col flex-grow overflow-hidden">
								<h3 className="text-3xl font-bold dark:text-white mb-1 mt-4">
									Conversations
								</h3>
								<div className="flex-grow flex flex-col overflow-auto mt-4 w-auto px-2 card-list-1-col">
									{displayChats(chats)}
								</div>
						</section>
					</aside>

					<main  className="flex flex-col overflow-hidden p-2 space-y-4 px-4">
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

					<AsideTabs sections={sections} />
        </div>
        <Footer />
    </div>
  );
};

export default Llm;









