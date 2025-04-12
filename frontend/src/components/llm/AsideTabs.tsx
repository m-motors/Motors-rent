import { FC, ReactNode, useState } from "react";

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

export default AsideTabs