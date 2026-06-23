import {useState} from "react";

export default function DeleteButton({label,onDelete, className}) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center z-[100] backdrop-blur-sm">
        <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full mx-4 shadow-2xl border-4 border-gray-50 transform transition-all animate-in fade-in zoom-in duration-300">
          <div className="text-center text-2xl font-black text-primary-950 tracking-tighter mb-2">¿Estás seguro?</div>
          <p className="text-gray-500 text-center mb-8 font-medium">Esta acción eliminará el elemento permanentemente.</p>
          <div className="flex gap-4">
            <button 
              type="button" 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl py-4 font-bold transition-all border-0 shadow-none hover:scale-105 active:scale-95"
              onClick={() => setShowConfirm(false)}>
              No, volver
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowConfirm(false);
              }}
              type="button"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-200 transition-all border-0 hover:scale-105 active:scale-95">
              Sí, Borrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button 
      type="button" 
      onClick={() => setShowConfirm(true)}
      className={className}
    >
      {label}
    </button>
  );
}