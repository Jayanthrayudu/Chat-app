import { useRef, useState } from "react";
import { Send, Smile } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import ErrorMessage from "../common/ErrorMessage";

const QUICK_EMOJIS = ["😀", "😂", "😍", "👍", "🙏", "🎉", "😢", "🔥"];

export default function MessageInput() {
  const { sendMessage, sendError, connectionStatus } = useChat();
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  const isDisconnected = connectionStatus === "DISCONNECTED";

  function handleSend() {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
    setShowEmoji(false);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function insertEmoji(emoji) {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  }

  return (
    <div className="shrink-0 border-t border-ink-800 bg-ink-900 p-3">
      {sendError && <ErrorMessage message={sendError} className="mb-2" />}
      {isDisconnected && (
        <p className="mb-2 text-xs font-medium text-amber-300">
          You're disconnected - messages will send once the connection is restored.
        </p>
      )}

      {showEmoji && (
        <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-ink-700 bg-ink-800 p-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="rounded-md p-1.5 text-lg hover:bg-ink-700"
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          aria-label="Toggle emoji picker"
          className="shrink-0 rounded-lg p-2.5 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
        >
          <Smile size={19} />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          aria-label="Message input"
          className="max-h-32 flex-1 resize-none rounded-xl border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-sm text-mist-50 placeholder:text-mist-300/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
          className="shrink-0 rounded-xl bg-signal p-2.5 text-white transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
