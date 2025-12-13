"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "¡Hola! Soy el asistente virtual de Restaurante Bambú. 🎋\n\nPuedo ayudarte a ver el menú, buscar platos específicos, o darte información sobre nosotros. ¿En qué te ayudo hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // Build history for Gemini API format (excluding the message we just added)
      const historyForAPI = messages.map(msg => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          history: historyForAPI 
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: "model", text: "⚠️ Lo siento, ocurrió un error: " + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: "model", text: data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", text: "⚠️ Error de conexión." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  // Dynamic sizes based on expanded state
  const chatWidth = isExpanded ? "w-[90vw] sm:w-[600px] md:w-[700px]" : "w-[360px] sm:w-[400px]";
  const chatHeight = isExpanded ? "h-[85vh]" : "h-[520px]";

  return (
    <div className={`fixed z-50 flex flex-col items-end ${isExpanded ? "inset-4" : "bottom-6 right-6"}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white shadow-2xl rounded-2xl ${chatWidth} ${chatHeight} ${isExpanded ? "ml-auto" : "mb-4"} flex flex-col overflow-hidden border border-gray-100 transition-all duration-300`}>
          
          {/* Header - Professional design with action buttons */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">🎋</span>
              </div>
              <div>
                <h3 className="font-semibold text-base">Asistente Bambú</h3>
                <p className="text-xs text-red-100 opacity-90">En línea • Responde al instante</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Minimize button (only show when expanded) */}
              {isExpanded && (
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Minimizar"
                  title="Minimizar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                </button>
              )}
              
              {/* Expand button (only show when not expanded) */}
              {!isExpanded && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Expandir"
                  title="Expandir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </button>
              )}
              
              {/* Close button */}
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-700 flex items-center justify-center transition-colors"
                aria-label="Cerrar chat"
                title="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <span className="text-sm">🎋</span>
                  </div>
                )}
                <div 
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-red-600 text-white rounded-2xl rounded-br-md shadow-sm" 
                      : "bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-sm">🎋</span>
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-red-600 text-white w-11 h-11 rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Abrir chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      )}
    </div>
  );
}
