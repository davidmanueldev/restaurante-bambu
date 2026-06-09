'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import {useProfile} from "@/components/UseProfile";
import {useState} from "react";

export default function UserForm({user,onSave}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const {data:loggedInUserData} = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
    if (propName === 'country') setCountry(value);
  }

  return (
    <div className="md:grid grid-cols-[.3fr_.7fr] gap-12 items-start mt-12 bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-gray-50 shadow-sm">
      <div className="mb-8 md:mb-0">
        <EditableImage link={image} setLink={setImage} />
      </div>
      <form
        className="space-y-4"
        onSubmit={ev =>
          onSave(ev, {
            name:userName, image, phone, admin,
            streetAddress, city, country, postalCode,
          })
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label>Nombres y Apellidos</label>
            <input
              type="text" placeholder="Nombre y Apellidos"
              value={userName} onChange={ev => setUserName(ev.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label>Email</label>
            <input
              type="email"
              disabled={true}
              value={user.email}
              placeholder={'email'}
              className="opacity-60"
            />
          </div>
        </div>

        <AddressInputs
          addressProps={{phone, streetAddress, postalCode, city, country}}
          setAddressProp={handleAddressChange}
        />

        {loggedInUserData.admin && (
          <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100 mt-6">
            <label className="flex items-center gap-3 cursor-pointer text-primary-800 font-bold" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" className="w-5 h-5 rounded-md text-primary-600 focus:ring-primary-500" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Privilegios de Administrador</span>
            </label>
          </div>
        )}
        
        <div className="pt-6">
          <button type="submit" className="primary">
            ACTUALIZAR PERFIL
          </button>
        </div>
      </form>
    </div>
  );
}