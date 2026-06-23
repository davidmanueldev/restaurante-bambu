'use client';
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTabs";
import Image from "next/image";
import toast from "react-hot-toast";

const REWARDS = [
  { id: 1, name: 'Bebida 500ml', points: 100, image: '/sallad1.png' },
  { id: 2, name: 'Guarnición Extra', points: 200, image: '/sallad2.png' },
  { id: 3, name: 'Postre Especial', points: 350, image: '/pizza.png' },
  { id: 4, name: 'Plato 1 Carne Gratis', points: 800, image: '/carne.png' },
];

export default function RecompensasPage() {
  const session = useSession();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const {status} = session;

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile').then(response => {
        response.json().then(data => {
          setUser(data);
          setIsAdmin(data.admin);
          setLoading(false);
        })
      });
    } else if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [session, status]);

  if (loading) {
    return <div className="text-center mt-24">Cargando perfil...</div>;
  }

  const userPoints = user?.points || 0;

  function handleRedeem(reward) {
    if (userPoints < reward.points) {
      toast.error('Puntos insuficientes');
      return;
    }
    // Lógica futura para registrar el canje
    toast.success(`¡Has canjeado ${reward.name}! Te contactaremos para entregarlo.`);
  }

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto">
      <UserTabs isAdmin={isAdmin} />
      
      <div className="mt-12 max-w-4xl mx-auto">
        <SectionHeaders mainHeader="Bambú Rewards" subHeader="Tu Fidelidad" />
        
        {/* Points Card */}
        <div className="bg-gradient-to-r from-bambu-900 to-bambu-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-leaf/20 blur-[80px] rounded-full"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-primary-300 uppercase tracking-[0.2em] font-bold text-sm mb-4">Saldo Actual</h3>
            <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
              {userPoints}
            </div>
            <p className="text-primary-100/70 font-medium">Puntos Acumulados</p>
          </div>
        </div>

        {/* Rewards Catalog */}
        <h3 className="text-2xl font-black text-primary-950 mb-8 text-center">Catálogo de Premios</h3>
        
        <div className="grid sm:grid-cols-2 gap-8">
          {REWARDS.map(reward => {
            const canRedeem = userPoints >= reward.points;
            return (
              <div key={reward.id} className="bg-white rounded-[2rem] p-6 border-2 border-gray-50 shadow-md flex items-center gap-6 transition-transform hover:-translate-y-1">
                <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 shrink-0">
                  <Image src={reward.image} alt={reward.name} width={100} height={100} className="w-full h-full object-contain" />
                </div>
                <div className="grow">
                  <h4 className="font-bold text-xl text-gray-800 mb-1">{reward.name}</h4>
                  <p className="text-primary-600 font-bold mb-4">{reward.points} pts</p>
                  <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`w-full py-3 rounded-full font-bold transition-all ${
                      canRedeem 
                        ? 'bg-accent-fire hover:bg-orange-500 text-white shadow-lg shadow-accent-fire/30 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'CANJEAR' : 'PUNTOS INSUFICIENTES'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
