import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({link, setLink}) {

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData;
      data.set('file', files[0]);

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          return response.json().then(link => {
            setLink(link);
          })
        }
        throw new Error('Something went wrong');
      });

      await toast.promise(uploadPromise, {
        loading: 'Subiendo...',
        success: 'Cargado',
        error: 'Error al subir',
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-gray-100 rounded-2xl p-2 w-full aspect-square relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200">
        {link && (
          <Image className="rounded-xl w-full h-full object-cover" src={link} width={250} height={250} alt={'avatar'} />
        )}
        {!link && (
          <div className="text-center text-gray-400 font-medium">
            Sin imagen
          </div>
        )}
      </div>
      <label className="w-full">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border-2 border-gray-100 bg-white hover:bg-gray-50 rounded-full p-3 text-center cursor-pointer font-bold text-gray-600 transition-all active:scale-95 shadow-sm">
          CAMBIAR FOTO
        </span>
      </label>
    </div>
  );
}