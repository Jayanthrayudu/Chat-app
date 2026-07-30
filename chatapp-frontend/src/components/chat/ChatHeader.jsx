import { ArrowLeft, Info } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import {
  getOtherParticipant,
  getRoomDisplayName,
  getRoomDisplayInitial,
} from "../../utils/privateChatUtils";

export default function ChatHeader({ onBack, onOpenInfo }) {
  const { activeRoom } = useChat();
  const { user } = useAuth();

  if (!activeRoom) {
    return null;
  }

  const otherParticipant = getOtherParticipant(activeRoom, user);
  const displayName = getRoomDisplayName(activeRoom, user);
  const initial = getRoomDisplayInitial(activeRoom, user);

  const onlineCount = (activeRoom.participants || []).filter(
    (participant) => participant.online
  ).length;

  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-800 bg-ink-900 px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="rounded-lg p-1.5 text-mist-200 hover:bg-ink-800 lg:hidden"
      >
        <ArrowLeft size={19} />
      </button>

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: activeRoom.avatarColor || "#3E63DD" }}
      >
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-mist-50">{displayName}</p>
        <p className="truncate text-xs text-mist-300">
          {activeRoom.isGroup
            ? `${activeRoom.participants?.length || 0} members · ${onlineCount} online`
            : otherParticipant?.online
            ? "Online"
            : "Offline"}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenInfo}
        aria-label="Room info"
        className="rounded-lg p-1.5 text-mist-200 hover:bg-ink-800 lg:hidden"
      >
        <Info size={19} />
      </button>
    </div>
  );
}