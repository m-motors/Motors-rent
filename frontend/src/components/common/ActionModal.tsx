// interface ActionModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     title: string;
//     item: any;
//     onDelete: (id: number) => void;
//   }
  
//   const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, title, item, onDelete }) => {
//     if (!isOpen) return null;
  
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
//           <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
//           <h2 className="text-xl font-bold mb-4">{title}</h2>
  
//           <pre className="text-sm text-gray-700">{JSON.stringify(item, null, 2)}</pre>
  
//           <div className="flex justify-end gap-4 mt-4">
//             <button
//               onClick={() => onDelete(item.id)}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//             >
//               Supprimer
//             </button>
//             <button
//               onClick={onClose}
//               className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Fermer
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default ActionModal;