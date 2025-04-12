import { FC, useCallback, useEffect, useRef, useState } from "react";

export interface SectionProps {
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

export default Models