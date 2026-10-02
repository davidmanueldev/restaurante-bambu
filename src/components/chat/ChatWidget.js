'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

// Sugerencias rápidas para iniciar conversación
const QUICK_ACTIONS = [
  { label: '🍖 ¿Qué me recomiendas?', text: '¿Qué plato me recomiendas para hoy?' },
  { label: '📋 Ver el menú', text: '¿Qué tienen en el menú?' },
  { label: '🕐 Horarios', text: '¿Cuál es su horario de atención?' },
  { label: '💳 Métodos de pago', text: '¿Qué métodos de pago aceptan?' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const session = useSession();

  // Scroll al último mensaje automáticamente
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Inicializar chat cuando se abre por primera vez
  useEffect(() => {
    if (isOpen && !initialized) {
      setInitialized(true);
      initializeChat();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  async function initializeChat() {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();
      setRecommendations(data);

      // Mensaje de bienvenida personalizado
      const userName = session?.data?.user?.name?.split(' ')[0] || null;
      const greeting = userName ? `¡Hola, ${userName}! 👋` : '¡Hola! 👋';
      const recsMessage = data.recommendations?.length > 0
        ? ` ${data.message}: **${data.recommendations.slice(0, 3).map(r => r.name).join('**, **')}**.`
        : '';

      const welcomeMsg = `${greeting} Soy el asistente virtual de **Bambú** 🎋. Estoy aquí para ayudarte con el menú, tus pedidos o cualquier pregunta.${recsMessage}\n\n¿En qué puedo ayudarte hoy?`;

      setMessages([{ role: 'assistant', content: welcomeMsg }]);
    } catch (e) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! 🎋 Soy el asistente de Bambú. ¿En qué puedo ayudarte hoy?',
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(text) {
    const trimmed = text?.trim();
    if (!trimmed || loading) return;

    setHasInteracted(true);
    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: messages, // historial previo (sin el msg actual)
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ups, hubo un problema de conexión 😅. Por favor, intenta de nuevo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      {/* ─── Chat Panel ─── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50"
          style={{ animation: 'slideUp 0.25s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-bambu-900 to-bambu-950 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-100/20 rounded-full flex items-center justify-center text-lg">
                🎋
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">Asistente Bambú</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-primary-300 text-xs">En línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors text-lg"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm shrink-0">
                  🎋
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center h-10">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (visible solo si el usuario no ha enviado mensajes aún) */}
          {!hasInteracted && !loading && messages.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.text)}
                  className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold px-3 py-1.5 rounded-full border border-primary-100 transition-colors whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-2 focus-within:border-primary-300 focus-within:bg-white transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0"
                aria-label="Enviar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-300 mt-2">Impulsado por Google Gemini ✨</p>
          </div>
        </div>
      )}

      {/* ─── Floating Button ─── */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={`fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full shadow-xl z-50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800 shadow-gray-300/40'
            : 'bg-primary-600 hover:bg-primary-700 shadow-primary-300/50'
        }`}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente Bambú'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>

      {/* CSS para la animación de entrada */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}
