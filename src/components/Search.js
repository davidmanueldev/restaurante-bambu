import { useMemo, useRef, useState } from 'react';
import { createAutocomplete } from '@algolia/autocomplete-core';
import MenuItem from '@/components/menu/MenuItem'; // Importa el componente MenuItem
import { CartContext } from '@/components/AppContext';
import { useContext } from 'react';

const AutocompleteItem = ({ _id, name, image, basePrice, sizes = [], extraIngredientPrices = [], setShowPopup, setMenuItem }) => {
  const handleClick = () => {
    // Asegúrate de pasar los datos completos
    setMenuItem({ _id, name, image, basePrice, sizes, extraIngredientPrices });
    setShowPopup(true);
  };

  return (
    <li>
      <button onClick={handleClick} className='hover:bg-red-300 flex gap-4 p-4'>
        <img src={image} alt={name} className='w-12 h-12 object-contain' />
        <div>
          <h3 className='text-sm font-semibold'>{name}</h3>
          <p className='text-xs text-gray-600'>Bs {basePrice}</p>
        </div>
      </button>
    </li>
  );
};

export default function Search(props) {
  const [autocompleteState, setAutocompleteState] = useState({
    collections: [],
    isOpen: false
  });
  const [showPopup, setShowPopup] = useState(false);
  const [menuItem, setMenuItem] = useState(null);  // Estado para almacenar el platillo seleccionado

  const autocomplete = useMemo(() => createAutocomplete({
    placeholder: 'Busca tu platillo favorito',
    onStateChange: ({ state }) => setAutocompleteState(state),
    getSources: () => [{
      sourceId: 'menu-items',
      getItems: ({ query }) => {
        if (!!query) {
          return fetch(`/api/menu-items?q=${query}`)
            .then(res => res.json())
            .then(data => {
              return data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
            });
        }
        return [];
      }
    }],
    ...props
  }), [props]);

  const formRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const formProps = autocomplete.getFormProps({
    inputElement: inputRef.current
  });
  const inputProps = autocomplete.getInputProps({
    inputElement: inputRef.current
  });

  return (
    <>
      <form ref={formRef} className="flex justify-center mb-20" {...formProps}>
        <div className="flex relative p-1 bg-gradient-to-tr from-orange-600 to-red-300 rounded-full w-2/6">
          <input ref={inputRef} className='flex-1 p-2 pl-4 rounded-full w-full' {...inputProps} />
          {
            autocompleteState.isOpen && (
              <div className="absolute mt-16 top-0 left-0 border border-gray-100 bg-white overflow-hidden rounded-lg shadow-lg z-10" ref={panelRef} {...autocomplete.getPanelProps()}>
                {autocompleteState.collections.map((collection, index) => {
                  const { items } = collection;
                  return (
                    <section key={`section-${index}`}>
                      {items.length > 0 && (
                        <ul {...autocomplete.getListProps()}>
                          {
                            items.map(item => 
                              <AutocompleteItem 
                                key={item._id} 
                                {...item} 
                                setShowPopup={setShowPopup} 
                                setMenuItem={setMenuItem} 
                              />
                            )
                          }
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            )
          }
        </div>
      </form>

      {/* Popup que muestra el detalle del platillo */}
      {showPopup && menuItem && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md">
            <MenuItem
              {...menuItem}
              setShowPopup={setShowPopup}  // Pasamos setShowPopup al componente MenuItem
            />
          </div>
        </div>
      )}
    </>
  );
}
