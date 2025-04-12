export type Message = {
	role: 'user' | 'assistant';
	content: string;
};

export type ChatHistoryProps = {
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

export default ChatHistory