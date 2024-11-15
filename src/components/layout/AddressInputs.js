// export default function AddressInputs({addressProps,setAddressProp,disabled=false}) {
//   const {phone, streetAddress, postalCode, city, country} = addressProps;
//   return (
//     <>
//       <label>Celular</label>
//       <input
//         disabled={disabled}
//         type="tel" placeholder="Número de celular"
//         value={phone || ''} onChange={ev => setAddressProp('phone', ev.target.value)} /> {/*Falta validar esta webada*/}
//       <label>Dirección</label>
//       <input
//         disabled={disabled}
//         type="text" placeholder="Dirección"
//         value={streetAddress || ''} onChange={ev => setAddressProp('streetAddress', ev.target.value)}
//       />
//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label>Código Postal</label>
//           <input
//             disabled={disabled}
//             type="text" placeholder="Ingrese su código postal"
//             value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
//           />
//         </div>
//         <div>
//           <label>Ciudad</label>
//           <input
//             disabled={disabled}
//             type="text" placeholder="Ciudad"
//             value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
//           />
//         </div>
//       </div>
//       <label>País</label>
//       <input
//         disabled={disabled}
//         type="text" placeholder="País"
//         value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
//       />
//     </>
//   );
// }
export default function AddressInputs({addressProps, setAddressProp, disabled = false}) {
  const {phone, streetAddress, postalCode, city, country} = addressProps;

  const handlePhoneKeyPress = (ev) => {
    const charCode = ev.charCode;
    if (charCode < 48 || charCode > 57) {
      ev.preventDefault();
    }
  };

  return (
    <>
      <label>Celular</label>
      <input
        disabled={disabled}
        type="tel"
        maxLength={8}
        minLength={8}
        pattern="[6-7][0-9]{7}"
        placeholder="Número de celular"
        value={phone || ''}
        onChange={ev => setAddressProp('phone', ev.target.value)}
        onKeyPress={handlePhoneKeyPress}
      />
      <label>Dirección</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Dirección"
        value={streetAddress || ''}
        onChange={ev => setAddressProp('streetAddress', ev.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>CI</label>
          <input
            disabled={disabled}
            type="text"
            maxLength="8"
            minLength={8}
            placeholder="Ingrese su código postal"
            value={postalCode || ''}
            // onChange={ev => setAddressProp('postalCode', ev.target.value)}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 8) {
                setAddressProp('postalCode', value);
              }
            }}
          />
        </div>
        <div>
          <label>Ciudad</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Ciudad"
            value={city || ''}
            onChange={ev => setAddressProp('city', ev.target.value)}
          />
        </div>
        <div>
          <label>País</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="País"
            value={country || ''}
            onChange={ev => setAddressProp('country', ev.target.value)}
          />
        </div>
      </div>
    </>
  );
}