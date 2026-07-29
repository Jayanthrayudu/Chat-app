import { formatRelativeDay } from "../../utils/dateUtils";
import { useAuth } from "../../hooks/useAuth";
import {
  getOtherParticipant,
  getRoomDisplayName,
  getRoomDisplayInitial,
} from "../../utils/privateChatUtils";

export default function ConversationItem({
  room,
  active,
  onClick,
}) {
  const { user } = useAuth();
  

  const otherParticipant =
    getOtherParticipant(
      room,
      user
    );

  const displayName =
    getRoomDisplayName(
      room,
      user
    );

  const initial =
    getRoomDisplayInitial(
      room,
      user
    );

  const isOnline = room.isGroup
    ? room.online
    : otherParticipant?.online;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={
        active
          ? "true"
          : undefined
      }
      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${
        active
          ? "bg-signal/15 ring-1 ring-signal/40"
          : "hover:bg-ink-800"
      }`}
    >
      <div className="relative shrink-0">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{
            backgroundColor:
              room.avatarColor ||
              "#3E63DD",
          }}
        >
          {initial}
        </div>

        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-ink-900 bg-emerald-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-mist-50">
            {displayName}
          </p>

          <span className="shrink-0 text-[11px] text-mist-300">
            {formatRelativeDay(
              room.lastMessageAt
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-mist-300">
            {room.lastMessage?.content ||
              "No messages yet"}  
          </p>

          {room.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-signal px-1.5 text-[11px] font-semibold text-white">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}