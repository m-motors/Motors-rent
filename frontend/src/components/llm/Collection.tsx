import { FC, useCallback, useEffect, useRef, useState } from "react";
import { CollectionType } from "../../pages/Llm";
import { SectionProps } from "./Models";

export interface CollectionsProps extends SectionProps {
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
								defaultValue=""
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

export default Collections