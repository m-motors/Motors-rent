export type ModalProps = {
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

export default Modal