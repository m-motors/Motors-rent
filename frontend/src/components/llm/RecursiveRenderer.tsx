
export type RecursiveRendererProps = {
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

export default RecursiveRenderer