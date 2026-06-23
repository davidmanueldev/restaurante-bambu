import FlyingButton from 'react-flying-item';

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) {
  const commonClasses = "bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 py-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary-200 w-full flex justify-center items-center gap-2";

  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4 w-full">
        <FlyingButton
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image}>
          <div onClick={onClick} className="w-full h-full flex items-center justify-center gap-2">
            Añadir <span className="text-primary-100/70 font-medium">Bs {basePrice}</span>
          </div>
        </FlyingButton>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={commonClasses}
    >
      <span>Elegir Opciones</span>
      <span className="text-primary-100/70 font-medium text-sm">Bs {basePrice}</span>
    </button>
  );
}