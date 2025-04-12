export type CardListProps<T> = {
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
		<ul className="flex flex-wrap gap-10 card-list">
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

export default CardList