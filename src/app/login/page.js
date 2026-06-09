'use client';
import {signIn} from "next-auth/react";
import Image from "next/image";
import {useState} from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);

    await signIn('credentials', {email, password, callbackUrl: '/'});

    setLoginInProgress(false);
  }
  return (
    <section className="mt-16 mb-24">
      <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] border-2 border-gray-50 shadow-2xl">
        <h1 className="text-center text-primary-950 text-5xl font-black tracking-tighter mb-8">
          Bienvenido
        </h1>
        <p className="text-center text-gray-400 mb-10 font-medium">
          Ingrese sus credenciales para continuar
        </p>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label>Correo Electrónico</label>
            <input type="email" name="email" placeholder="test@example.com" value={email}
                   disabled={loginInProgress}
                   onChange={ev => setEmail(ev.target.value)} />
          </div>
          <div>
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" value={password}
                   disabled={loginInProgress}
                   onChange={ev => setPassword(ev.target.value)}/>
          </div>
          <div className="pt-4">
            <button disabled={loginInProgress} type="submit" className="primary">
              INICIAR SESIÓN
            </button>
          </div>
          <div className="my-8 flex items-center gap-4 text-gray-300">
            <hr className="grow border-gray-100" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">o continuar con</span>
            <hr className="grow border-gray-100" />
          </div>
          <button type="button" onClick={() => signIn('google', {callbackUrl: '/'})}
                  className="flex gap-4 justify-center bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-100">
            <Image src={'/google.png'} alt={'google'} width={24} height={24} />
            Google
          </button>
        </form>
      </div>
    </section>
  );
}