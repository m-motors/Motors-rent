// src/AdminPage.js
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

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

type ChatType =  {
	name: string,
	id: string,
	description: string,
	vectorstore_id: string | null,
	chat: {
		history: [],
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
	const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
		fetchModels();
    fetchChats();
  }, []);

	const fetchModels = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/llm`);
			setModels(prev => [...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	const fetchChats = async () => {
		try {
			const res: any = await axios.get(`${host}/api/rag/chats`);
			setChats(prev => [...res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	};

	// const displayModel = () => {
	// 	return (
	// 		<ul>
	// 			{
	// 				models.map((model, index) => (
	// 					<li key={index}>
	// 						<div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
	// 							<h4>{model.name}</h4>
	// 							<details>
	// 								<summary>More</summary>
	// 								<ul>
	// 									<li>
	// 										Model : {model.model}
	// 									</li>
	// 									<li>
	// 										Taille : {model.size.toString()}
	// 									</li>
	// 									<li>
	// 										Nombre de paramètres : {model.details.parameter_size} 
	// 									</li>
	// 								</ul>
	// 								<button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1 me-1 mb-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(event)=>removeModel(event, model.name)}>Remove</button>
	// 							</details>
	// 						</div>
	// 					</li>
	// 				))
	// 			}
	// 		</ul>
	// 	)
	// }

	const displayModel = () => (
		<CardList<ModelType>
			items={models}
			getKey={(model, index) => model.name || index}
			onRemove={(event, model) => removeModel(event, model.name)}
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
			
			setModels((prev) => [...prev, res.data.content]);
		} catch (error: any) {
			console.error(error)
		}
	}

	const removeModel = async (event:React.MouseEvent<HTMLButtonElement>, modelName: String) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/llm`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					llm_model_name: modelName
				}
			});
			
			setModels((prev) => prev.filter((model) => model.name !== modelName));
		} catch (error: any) {
			console.error(error)
		}
	};

	// const displayChat = () => {
	// 	return (
	// 		<ul>
	// 			{
	// 				chats.map((chat, index) => (
	// 					<li key={index}>
	// 						<div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
	// 							<h4>{chat.name}</h4>
	// 							<details>
	// 								<summary>More</summary>
	// 								<ul>
	// 									<li>
	// 										Id : {chat.id}
	// 									</li>
	// 									<li>
	// 										Description : {chat.description}
	// 									</li>
	// 									<li>
	// 									vectorstore_id : {chat.vectorstore_id}
	// 									</li>
	// 									<li>
	// 										<details>
	// 											<summary>Chat</summary>
	// 											<ul>
	// 												<li>
	// 													History : {JSON.stringify(chat.chat.history)}
	// 												</li>
	// 												<li>
	// 													LLM model name: {chat.chat.llm_model_name}
	// 												</li>
	// 												<li>
	// 													Stream: {chat.chat.stream}
	// 												</li>
	// 												<li>
	// 													<details>
	// 														<summary>options</summary>
	// 														<ul>
	// 															<li>
	// 																Num_ctx : {chat.chat.options.num_ctx}
	// 															</li>
	// 															<li>
	// 																Num_gpu : {chat.chat.options.num_gpu}
	// 															</li>
	// 															<li>
	// 																Num_predict : {chat.chat.options.num_predict}
	// 															</li>
	// 															<li>
	// 																Repeat_last_n : {chat.chat.options.repeat_last_n}
	// 															</li>
	// 															<li>
	// 																Repeat_penalty : {chat.chat.options.repeat_penalty}
	// 															</li>
	// 															<li>
	// 																Seed : {chat.chat.options.seed}
	// 															</li>
	// 															<li>
	// 																Stop : {chat.chat.options.stop}
	// 															</li>
	// 															<li>
	// 																Temperature : {chat.chat.options.temperature}
	// 															</li>
	// 															<li>
	// 																Top_k : {chat.chat.options.top_k}
	// 															</li>
	// 															<li>
	// 																Top_p : {chat.chat.options.top_p}
	// 															</li>
	// 														</ul>
	// 													</details>
	// 												</li>
	// 											</ul>
	// 										</details>
	// 									</li>
	// 								</ul>
	// 								<button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(event)=>removeChat(event, chat.id)}>Remove</button>
	// 							</details>
	// 						</div>
	// 					</li>
	// 				))
	// 			}
	// 		</ul>
	// 	)
	// }

	const displayChat = () => (
		<CardList<ChatType>
			items={chats}
			getKey={(chat, index) => chat.id || index}
			onRemove={(event, chat) => removeChat(event, chat.id)}
			renderDetails={(chat) => (
				<>
					<h4>{chat.name}</h4>
					<RecursiveRenderer data={chat} />
				</>
			)}
		/>
	);

	const removeChat = async (event:React.MouseEvent<HTMLButtonElement>, id: String) => {
		event.preventDefault()
		try {
			const res = await axios.delete(`${host}/api/rag/chats`, {
				headers: {
					"Content-Type": "application/json"
				},
				data: {
					id: id
				}
			});
			
			setChats((prev) => prev.filter((chat) => chat.id !== id));
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
	

  return (
    <div>
        <Header />

        <div className="min-h-screen bg-gray-900 p-6 text-white flex gap-24">

					<section className="w-100">
						<h3 className="text-3xl font-bold dark:text-white mb-4 mt-8">Models</h3>
						<form onSubmit={event => handleSubmitAddModel(event)} className="max-w-sm mx-auto">
							<div>
								<label  htmlFor="modelName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom *</label>
								<input id="modelName" type="text" name="modelName" placeholder="Nom du model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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

						{
							displayModel()
						}
					</section>

					<section className="w-100">
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
						{
							displayChat()
						}



					</section>


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
};

const CardList = <T,>({
	items,
	renderDetails,
	getKey,
	onRemove,
	removeLabel = "Remove"
}: CardListProps<T>) => {
	return (
		<ul>
			{items.map((item, index) => (
				<li key={getKey(item, index)} className="max-w-full">
					<div className="w-full max-w-sm overflow-hidden text-ellipsis break-words p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
						{renderDetails(item)}
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
		return (
			<li style={{ marginLeft: level * 10 }}>
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
		);
	}

	return <span>Unsupported type</span>;
};
