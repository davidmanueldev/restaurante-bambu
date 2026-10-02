'use client';

/**
 * ChatMessage — Renders a single chat bubble (user or assistant).
 * Supports basic markdown: **bold**, *italic*, bullet lists, and line breaks.
 */
export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  // Simple markdown-to-JSX renderer
  function renderContent(text) {
    // Split by line breaks
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.slice(2);
        return (
          <li key={i} className="ml-3 list-disc">
            {renderInline(bulletText)}
          </li>
        );
      }
      // Empty line → spacer
      if (line.trim() === '') {
        return <br key={i} />;
      }
      // Normal line
      return <p key={i}>{renderInline(line)}</p>;
    });
  }

  // Render **bold** and *italic* inline
  function renderInline(text) {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {/* Avatar del asistente */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
          🎋
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        <div className="space-y-1">
          {renderContent(content)}
        </div>
      </div>

      {/* Avatar del usuario */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm shrink-0 ml-2 mt-0.5 text-white font-bold">
          Tú
        </div>
      )}
    </div>
  );
}
