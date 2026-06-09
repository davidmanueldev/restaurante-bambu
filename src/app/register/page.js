"use client";
import {signIn} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'Content-Type': 'application/json'},
    });
    if (response.ok) {
      setUserCreated(true);
    }
    else {
      setError(true);
    }
    setCreatingUser(false);
  }
  return (
    <section className="mt-16 mb-24">
      <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] border-2 border-gray-50 shadow-2xl">
        <h1 className="text-center text-primary-950 text-5xl font-black tracking-tighter mb-8">
          Crear Cuenta
        </h1>
        
        {userCreated && (
          <div className="my-6 text-center bg-primary-50 p-4 rounded-2xl border border-primary-100 text-primary-800 font-medium">
            ¡Usuario creado exitosamente!<br />
            Ya puedes{' '}
            <Link className="underline font-bold" href={'/login'}>Iniciar Sesión &raquo;</Link>
          </div>
        )}
        
        {error && (
          <div className="my-6 text-center bg-red-50 p-4 rounded-2xl border border-red-100 text-red-800 font-medium">
            Ha ocurrido un error.<br />
            Por favor, intente de nuevo más tarde.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label>Correo Electrónico</label>
            <input type="email" placeholder="test@example.com" value={email}
                   disabled={creatingUser}
                   onChange={ev => setEmail(ev.target.value)} />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" value={password}
                   disabled={creatingUser}
                    onChange={ev => setPassword(ev.target.value)}/>
          </div>
          <div className="pt-4">
            <button type="submit" disabled={creatingUser} className="primary">
              REGISTRARSE
            </button>
          </div>
          
          <div className="my-8 flex items-center gap-4 text-gray-300">
            <hr className="grow border-gray-100" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">o continuar con</span>
            <hr className="grow border-gray-100" />
          </div>

          <button
            type="button"
            onClick={() => signIn('google', {callbackUrl:'/'})}
            className="flex gap-4 justify-center bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-100">
            <Image src={'/google.png'} alt={'google'} width={24} height={24} />
            Google
          </button>
          
          <div className="text-center mt-8 text-gray-500 font-medium border-t border-gray-50 pt-8">
            ¿Ya tienes una cuenta?{' '}
            <Link className="text-primary-600 font-bold hover:underline" href={'/login'}>Inicia Sesión aquí</Link>
          </div>
        </form>
      </div>
    </section>
  );
}