import { MessageSquareText } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ onBack }) {
  const { activeRoom } = useChat();

  if (!activeRoom) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 bg-ink-950 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-800 text-signal-light">
          <MessageSquareText size={26} />
        </div>
        <h2 className="font-display text-lg font-semibold text-mist-50">Select a conversation</h2>
        <p className="max-w-xs text-sm text-mist-300">
          Choose a conversation from the list, or start a new one, to begin messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-ink-950">
      <ChatHeader onBack={onBack} />
      <MessageList />
      <MessageInput />
    </div>
  );
}
