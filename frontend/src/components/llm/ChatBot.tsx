import { useEffect, useRef, useState } from "react";
import { MdAssistant, MdClose } from "react-icons/md";

import ChatHistory from "./ChatHistory";
import { ChatType } from "../../pages/Llm";
import { useApi } from "../../hooks/useApi";

const ChatBot = () => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatModalRef = useRef<HTMLDivElement | null>(null);

  const api = useApi();  

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (chatModalRef.current && !chatModalRef.current.contains(event.target as Node)) {
          setIsChatOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isChatOpen]);
  

  const toggleChat = () => setIsChatOpen(prev => !prev);

  const fetchChats = async () => {
    try {
      const res = await api.get(`/api/rag/chats`);
      const chats = res.data.content;
      setChats(chats);
    } catch (error) {
      console.error("Erreur lors de la récupération des chats :", error);
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

  const handleGenerateResponse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const question = formData.get("prompt") as string;

    if (!currentChatId || !question.trim()) return;

    const currentCollection = chats.find((chat) => chat.id === currentChatId)?.collection;
    const currentCollectionId = typeof currentCollection === "string" ? currentCollection : currentCollection?.id;

    if (!currentCollectionId) return console.error("Aucune collection associée à la discussion actuelle.");

    try {
      const res = await api.post(`/api/rag`, {
          question,
          id: currentChatId,
          collection: currentCollectionId
        }
      );

      const response = res.data.content;

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

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
        type="button">
        <MdAssistant className="text-2xl" />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-28 right-8 z-50 max-w-full w-auto" ref={chatModalRef}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">

            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Assistant IA</h2>
              <button 
                onClick={toggleChat} 
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            <div className="flex flex-col p-4 space-y-4 overflow-auto">
              <select
                id="chatId"
                name="chatId"
                onChange={handleChangeCurrentChat}
                value={currentChatId ?? ""}
                className="bg-gray-100 dark:bg-gray-700 dark:text-white text-sm rounded px-3 py-2 border-none focus:outline-none"
              >
                <option value="">Sélectionnez une discussion</option>
                {chats.map((chat) => (
                  <option key={chat.id} value={chat.id}>{chat.name}</option>
                ))}
              </select>

              {currentChatId && (
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-10rem-295px)] rounded-lg p-2 bg-white dark:bg-gray-900">
                  <ChatHistory history={chats.find((chat) => chat.id === currentChatId)?.chat.history || []} />
                </div>
              )}

              <form onSubmit={handleGenerateResponse}>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={3}
                  placeholder="Tapez votre question ici..."
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm border-none focus:outline-none resize-none"
                  style={{ height: '100px' }}
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
