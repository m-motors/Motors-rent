import { FC, useCallback, useEffect, useRef, useState } from "react";
import { CollectionType, ModelType } from "../../pages/Llm";
import { SectionProps } from "./Models";

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
						defaultValue=""
					>
						<option value="">Nom du model LLM</option>
						{models.map((model: ModelType) => (
							<option key={model.name} value={model.name}>
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
						defaultValue=""
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

export default Chats