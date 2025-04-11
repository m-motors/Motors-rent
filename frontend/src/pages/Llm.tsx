// src/AdminPage.js
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import './llm.css'

type ModelType =  {
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

type EmbedderType =  {
	name: string,
	id: string,
	model_name: string,
	embedder_instance: boolean,
	device: string,
	is_encode_kwargs: boolean
}

type CollectionType =  {
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
			const res: any = await axios.get(`${host}/api/rag/llm`);
			setModels(prev => [...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const displayModels = (models: ModelType[]) => {
		const sortedmodels = [...models].sort((a, b) => a.name.localeCompare(b.name));

		return (
			<CardList<ModelType>
				items={sortedmodels}
				getKey={(model, index) => model.name || index}
				onRemove={(event, model) => removeModel(event, model)}
				renderDetails={(model) => (
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

	const displayEmbedders = (embedders: EmbedderType[]) => {
		const sortedembedders = [...embedders].sort((a, b) => a.name.localeCompare(b.name));

		return (
			<CardList<EmbedderType>
				items={sortedembedders}
				getKey={(embedder, index) => embedder.id || index}
				onRemove={(event, embedder) => removeEmbedder(event, embedder)}
				renderDetails={(embedder) => (
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

	const fetchCollections = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/collections`);
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
			getKey={(collection, index) => collection.id || index}
			onRemove={(event, collection) => removeCollection(event, collection)}
			renderDetails={(collection) => (
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
			const res = await axios.post(`${host}/api/rag/collections`,
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

			res.data.content.embedder =  embedders.find(e => e.id === res.data.content.embedder)
			
			setCollections((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const removeCollection 	= async (event:React.MouseEvent<HTMLButtonElement>, collection: CollectionType) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/collections`, {
				headers: {
					"Content-Type": "application/json"
				},
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
			const res = await axios.post(`${host}/api/rag/collections/search`,
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

			displayModal(displayCollections(res.data.content))
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
			const res: any = await axios.get(`${host}/api/rag/chats`);
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
				getKey={(chat, index) => chat.name || index}
				onRemove={(event, chat) => removeChat(event, chat)}
				onSelect={(event, chat) => handleChangeCurrentChat(event, chat)}
				renderDetails={(chat) => (
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
		const collection = formData.get("collectionId") as string;		

		try {
			const res = await axios.post(`${host}/api/rag/chats`,
				{ 
					name: name,
					description: description,
					llm_model_name: llm_model_name,
					options: options,
					collection: collection 
				},
				{
					headers: {
						"Content-Type": "application/json"
					}
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
		const formData = new FormData(event.currentTarget);
		const question = formData.get("prompt") as string;
	
		if (!currentChatId || !question.trim()) return;
	
		try {
			const res = await axios.post(`${host}/api/rag`, {
				question: question,
				id: currentChatId,
				collection: chats.find((chat) => chat.id === currentChatId)?.collection
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

	const sections = [
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

				<div style={{ height: "calc(100vh - 60px - 112px)", gridTemplateColumns: 'auto 1fr 1.5fr'}} className="bg-gray-900 px-6 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<aside  className="p-4 h-full flex flex-col overflow-hidden">
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
						<section  className="flex flex-col flex-grow overflow-hidden">
								<h3 className="text-3xl font-bold dark:text-white mb-1 mt-4">
									Conversations
								</h3>
								<div className="flex-grow flex flex-col overflow-auto mt-4 w-auto px-2">
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
						{(onSelect || onRemove) && (
          		<div className="flex justify-end gap-2 mt-2">
								{onSelect && (
									<button
										className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 text-center mb-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
										onClick={(event) => onSelect(event, item)}
									>
										{selectLabel}
									</button>
								)}
								{onRemove && (
									<button
										className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2 text-center mb-2 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
										onClick={(event) => onRemove(event, item)}
									>
										{removeLabel}
									</button>
								)}
								</div>
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
	keyOrder?: string[];
};

const RecursiveRenderer = ({ data, level = 0, parentKey = "", keyOrder = [] }: RecursiveRendererProps) => {
	if (data === null || data === undefined)
		return <span className="italic text-gray-400">null</span>;

	if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
		return <span>{data.toString()}</span>;
	}

	if (Array.isArray(data)) {
		return (
			<details className={`ml-${Math.min(level * 4, 32)}`}>
				<summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
					{parentKey || "Array"}
				</summary>
				<ul className="ml-4 list-disc">
					{data.map((item, index) => (
						<li key={index}>
							<RecursiveRenderer data={item} level={level + 1} />
						</li>
					))}
				</ul>
			</details>
		);
	}

	if (typeof data === "object") {
		let entries = Object.entries(data);
		if (keyOrder.length > 0) {
			entries = [
				...keyOrder
					.filter((key) => key in data)
					.map((key) => [key, data[key]] as [string, any]),
				...Object.entries(data).filter(([key]) => !keyOrder.includes(key)),
			];
		}
		const primitives = entries.filter(
			([, value]) =>
				value === null ||
				typeof value === "string" ||
				typeof value === "number" ||
				typeof value === "boolean"
		);
		const complexes = entries.filter(
			([, value]) =>
				typeof value === "object" && value !== null
		);

		const renderItems = () => (
			<ul className={`pl-${level * 2}`}>
				{primitives.map(([key, value]) => (
					<li key={key} className="mb-1">
						<strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong>{" "}
						<span>{value?.toString()}</span>
					</li>
				))}
				{complexes.map(([key, value]) => (
					<li key={key} className="mb-1">
						<RecursiveRenderer data={value} level={level + 1} parentKey={key} />
					</li>
				))}
			</ul>
		);

		if (level === 0) {
			return renderItems();
		}

		return (
			<ul className={`pl-${level * 2}`}>
				<li>
					<details open={level === 0}>
						<summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
							{parentKey || "Object"}
						</summary>
						{renderItems()}
					</details>
				</li>
			</ul>
		);
	}

	return <span className="text-red-500">Unsupported type</span>;
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

interface Section {
  name: string;
  node: ReactNode;
}

interface AsideTabsProps {
  sections: Section[];
}

const AsideTabs: FC<AsideTabsProps> = ({ sections }) => {
  const [activeTab, setActiveTab] = useState<string>(
    sections[0]?.name || ""
  );

  return (
    <aside className="p-4 h-full flex flex-col overflow-hidden">
      <nav className="font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {sections.map(({ name }) => (
            <li
              key={name}
              className={`cursor-pointer px-3 py-1 ${
                activeTab === name
                  ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                  : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      </nav>
				
			<div className="flex-grow flex flex-col overflow-hidden mt-4">
				{sections.map(
					({ name, node }) =>
						activeTab === name && (
              <section key={name} className="flex flex-col flex-grow overflow-hidden">
								<h3 className="text-3xl font-bold dark:text-white mb-1 mt-4">
									{name}
								</h3>
								<div className="flex-grow flex flex-col overflow-hidden mt-4">
									{node}
								</div>
							</section>
						)
				)}
			</div>
    </aside>
  );
};


interface SectionProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  renderList: () => React.ReactNode;
  moreActions ?: ((event: React.FormEvent<HTMLFormElement>) => void)[];
}

const Models: FC<SectionProps> = ({ onSubmit, renderList }) => {
  const [scroll, setScroll] = useState({ scrollY: 0, close: false });
  const [canCollapse, setCanCollapse] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const listElement = listRef.current;

    if (!scrollContainer || !listElement) return;

    const updateCollapseState = () => {
      const scrollable = scrollContainer.clientHeight < listElement.clientHeight;
      setCanCollapse(scrollable);
    };

    const resizeObserver = new ResizeObserver(updateCollapseState);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(listElement);

    updateCollapseState();

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scrollValue = (event.target as HTMLDivElement).scrollTop;


      setScroll((prev) => {
        if (Math.abs(prev.scrollY - scrollValue) > 20) {
          return {
            scrollY: scrollValue,
            close: scrollValue > prev.scrollY,
          };
        }
        return { ...prev, scrollY: scrollValue };
      });
    },
    []
  );

  return (
    <div className="overflow-y-auto flex flex-col gap-8" onScroll={canCollapse ? handleScroll: undefined}  ref={scrollContainerRef}>
			<div className={`flex flex-col gap-4 bg-gray-900 px-2 shadow-md transition-all duration-500 ease-in-out transform pb-4
          ${canCollapse ? 'sticky top-0' : 'relative'}
          ${canCollapse && scroll.close ? '-translate-y-full' : 'translate-y-0'}
        `}>
				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-4">
					<h5 className="text-xl font-bold dark:text-white">Ajouter un model</h5>
					<div>
						<label htmlFor="modelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Nom *
						</label>
						<input
							id="modelName"
							type="text"
							name="modelName"
							placeholder="Nom du model"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							title="string"
							aria-describedby="helper-text-explanation"
						/>
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Correspond au model de langage utilisé pour traiter les échanges
							<p>
								Nom du model trouvé sur : <a href="https://ollama.com/search" className="text-blue-600 underline">Ollama</a>
							</p>
							<p>
								Conseillé : <span>mistral:7b</span> ou <span>llama2:7b</span>
							</p>
						</div>
					</div>
					<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
						type="submit"
					>
						Ajouter le model
					</button>
				</form>
			</div>
			<div ref={listRef}>
        <h5 className="text-xl font-bold dark:text-white mb-4">Liste des models</h5>
        {renderList()}
      </div>
    </div>
  );
};


const Embedders: FC<SectionProps> = ({ onSubmit, renderList, moreActions}) => {
  const [scroll, setScroll] = useState({ scrollY: 0, close: false });
  const [canCollapse, setCanCollapse] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const listElement = listRef.current;

    if (!scrollContainer || !listElement) return;

    const updateCollapseState = () => {
      const scrollable = scrollContainer.clientHeight < listElement.clientHeight;
      setCanCollapse(scrollable);
    };

    const resizeObserver = new ResizeObserver(updateCollapseState);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(listElement);

    updateCollapseState();

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scrollValue = (event.target as HTMLDivElement).scrollTop;


      setScroll((prev) => {
        if (Math.abs(prev.scrollY - scrollValue) > 20) {
          return {
            scrollY: scrollValue,
            close: scrollValue > prev.scrollY,
          };
        }
        return { ...prev, scrollY: scrollValue };
      });
    },
    []
  );

  return (
    <div className="overflow-y-auto flex flex-col gap-8" onScroll={canCollapse ? handleScroll: undefined}  ref={scrollContainerRef}>
			<div className={`flex flex-col gap-4 bg-gray-900 px-2 shadow-md transition-all duration-500 ease-in-out transform pb-4
          ${canCollapse ? 'sticky top-0' : 'relative'}
          ${canCollapse && scroll.close ? '-translate-y-full' : 'translate-y-0'}
        `}>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<h5 className="text-xl font-bold dark:text-white">Ajouter un embedder</h5>
					<div>
						<label htmlFor="modelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du model</label>
						<input 
							id="modelName" 
							type="text" 
							name="modelName" 
							placeholder="Nom du model" 
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Conseiller : <span>all-MiniLM-L6-v2</span>
						</div>
					</div>
					<div>
						<label  htmlFor="isEncodeKwargs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Encode kwargs</label>
						<input id="isEncodeKwargs" type="text" name="isEncodeKwargs" placeholder="Encode kwargs" title='boolean' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
					</div>
					<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
						type="submit">
						Ajouter le embedder
					</button>
				</form>

				{
					moreActions && (
					<form onSubmit={event => moreActions[0](event)} className="flex flex-col gap-4">
						<h5 className="text-xl font-bold dark:text-white">Rechercher un embedder</h5>
						<div className="flex flex-row gap-4">
							<div className="w-full">
								<label  htmlFor="embedderId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de l'embedder</label>
								<input id="embedderId" type="text" name="embedderId" placeholder="Id de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
							</div>

							<div className="w-full">
								<label  htmlFor="embedderName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de l'embedder</label>
								<input id="embedderName" type="text" name="embedderName" placeholder="Nom de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
							</div>
						</div>
						
						<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
						type="submit">Rechercher l'embedder</button>
				</form>
				)
			}

			</div>
			
			<div ref={listRef}>
				<h5 className="text-xl font-bold dark:text-white mb-4">Liste des embedders</h5>
				{
					renderList()
				}
			</div>
		</div>
	)
}

interface CollectionsProps extends SectionProps {
  collections: CollectionType[];
}

const Collections: FC<CollectionsProps> = ({ onSubmit, renderList, moreActions, collections}) => {
  const [scroll, setScroll] = useState({ scrollY: 0, close: false });
  const [canCollapse, setCanCollapse] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const listElement = listRef.current;

    if (!scrollContainer || !listElement) return;

    const updateCollapseState = () => {
      const scrollable = scrollContainer.clientHeight < listElement.clientHeight;
      setCanCollapse(scrollable);
    };

    const resizeObserver = new ResizeObserver(updateCollapseState);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(listElement);

    updateCollapseState();

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scrollValue = (event.target as HTMLDivElement).scrollTop;


      setScroll((prev) => {
        if (Math.abs(prev.scrollY - scrollValue) > 20) {
          return {
            scrollY: scrollValue,
            close: scrollValue > prev.scrollY,
          };
        }
        return { ...prev, scrollY: scrollValue };
      });
    },
    []
  );

  return (
    <div className="overflow-y-auto flex flex-col gap-8" onScroll={canCollapse ? handleScroll: undefined}  ref={scrollContainerRef}>
			<div className={`flex flex-col gap-4 bg-gray-900 px-2 shadow-md transition-all duration-500 ease-in-out transform pb-4
          ${canCollapse ? 'sticky top-0' : 'relative'}
          ${canCollapse && scroll.close ? '-translate-y-full' : 'translate-y-0'}
        `}>

				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<h5 className="text-xl font-bold dark:text-white">Ajouter une collection</h5>
					<div>
						<label htmlFor="collectionName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la collection</label>
						<input 
							id="collectionName" 
							type="text" 
							name="collectionName" 
							placeholder="Nom de la collection"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						</div>
					</div>
					<div>
						<label htmlFor="persistDirectory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repertoire persisté</label>
						<input 
							id="persistDirectory" 
							type="text" 
							name="persistDirectory" 
							placeholder="Repertoire persisté"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						</div>
					</div>
					<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
						type="submit">
						Creer le collection
					</button>
				</form>

				{
					moreActions && (
					<>
						<form onSubmit={event => moreActions[0](event)} className="flex flex-col gap-4">
							<h5 className="text-xl font-bold dark:text-white">Rechercher une collection</h5>
							<div className="flex flex-row gap-4">
								<div className="w-full">
									<label  htmlFor="embedderId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Id de l'embedder</label>
									<input id="embedderId" type="text" name="embedderId" placeholder="Id de l'embedder" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>

								<div className="w-full">
									<label  htmlFor="collectionName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la collection</label>
									<input id="collectionName" type="text" name="collectionName" placeholder="Nom de la collection" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
								</div>
							</div>
							
							<button
							className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
							type="submit">Rechercher la collection</button>
					</form>

					<form onSubmit={event => moreActions[1](event)} className="flex flex-col gap-4">
						<h5 className="text-xl font-bold dark:text-white">Ajouter des éléments à la collection</h5>
						<div className="flex flex-row gap-4">
							<div className="w-full">
								<label  htmlFor="storeId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Store Id *</label>
								<select
								id="storeId"
								name="storeId"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								title="Sélectionnez un Collection"
								required
							>
								<option value="">Sélectionnez une collection</option>
								{collections.map((collection: CollectionType) => (
									<option key={collection.id} value={collection.id}>
										{collection.name}
									</option>
								))}
							</select>
							</div>

							<div className="w-full">
								<label  htmlFor="dirs" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du repertoire</label>
								<input id="dirs" type="text" name="dirs" placeholder="Nom du repertoire" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" title="string"/>
							</div>
						</div>
						
						<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
						type="submit">Ajouter à la collection</button>
					</form>
				</>
				)
			}
			</div>
			
			<div ref={listRef}>
				<h5 className="text-xl font-bold dark:text-white mb-4">Liste des collections</h5>
				{
					renderList()
				}
			</div>
		</div>
	)
}

interface ChatsProps extends SectionProps {
  models: ModelType[];
  collections: CollectionType[];
}

const Chats: FC<ChatsProps> = ({ onSubmit, renderList, models, collections}) => {
  const [scroll, setScroll] = useState({ scrollY: 0, close: false });
  const [canCollapse, setCanCollapse] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const listElement = listRef.current;

    if (!scrollContainer || !listElement) return;

    const updateCollapseState = () => {
      const scrollable = scrollContainer.clientHeight < listElement.clientHeight;
      setCanCollapse(scrollable);
    };

    const resizeObserver = new ResizeObserver(updateCollapseState);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(listElement);

    updateCollapseState();

    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scrollValue = (event.target as HTMLDivElement).scrollTop;


      setScroll((prev) => {
        if (Math.abs(prev.scrollY - scrollValue) > 20) {
          return {
            scrollY: scrollValue,
            close: scrollValue > prev.scrollY,
          };
        }
        return { ...prev, scrollY: scrollValue };
      });
    },
    []
  );

  return (
    <div className="overflow-y-auto flex flex-col gap-8" onScroll={canCollapse ? handleScroll: undefined}  ref={scrollContainerRef}>
			<div className={`flex flex-col gap-4 bg-gray-900 px-2 shadow-md transition-all duration-500 ease-in-out transform pb-4
          ${canCollapse ? 'sticky top-0' : 'relative'}
          ${canCollapse && scroll.close ? '-translate-y-full' : 'translate-y-0'}
        `}>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<h5 className="text-xl font-bold dark:text-white">Ajouter un chat</h5>
					<div>
						<label htmlFor="chatName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom *</label>
						<input 
							id="chatName" 
							type="text" 
							name="chatName" 
							placeholder="Nom *" 
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						</div>
					</div>
					<select
						id="llmModelName"
						name="llmModelName"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						title="Sélectionnez un Collection"
						required
					>
						<option value="">Nom du model LLM</option>
						{models.map((model: ModelType) => (
							<option key={model.digest} value={model.digest}>
								{model.name}
							</option>
						))}
					</select>
					<div>
						<label htmlFor="collections" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
						<input 
							id="collections" 
							type="text" 
							name="collections" 
							placeholder="Description" 
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						</div>
					</div>
					<select
						id="collectionId"
						name="collectionId"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						title="Sélectionnez un Collection"
						required
					>
						<option value="">Collection</option>
						{collections.map((collection: CollectionType) => (
							<option key={collection.id} value={collection.id}>
								{collection.name}
							</option>
						))}
					</select>

					<div>
						<label htmlFor="Options" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Options</label>
						<input 
							disabled
							id="Options" 
							type="text" 
							name="Options" 
							placeholder="Options" 
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
							title="string"							
							aria-describedby="helper-text-explanation"/>
						<div id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
						</div>
					</div>
					<button
						className="w-auto self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
						type="submit">
						Ajouter le chat
					</button>
				</form>
			</div>
			
			<div ref={listRef}>
				<h5 className="text-xl font-bold dark:text-white mb-4">Liste des chats</h5>
				{
					renderList()
				}
			</div>
		</div>
	)
}