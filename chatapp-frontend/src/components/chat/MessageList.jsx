import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import MessageBubble from "./MessageBubble";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { formatDayDivider, isSameDay } from "../../utils/dateUtils";
import { useChat } from "../../hooks/useChat";

export default function MessageList() {
  const {
    messages,
    messagesLoading,
    messagesError,
    selectRoom,
    activeRoomId,
    loadOlderMessages,
    hasMoreMessages,
    loadingOlderMessages,
  } = useChat();

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isNearBottomRef = useRef(true);
  const prevScrollHeightRef = useRef(null);

  function scrollToBottom(behavior = "smooth") {
    bottomRef.current?.scrollIntoView({ behavior });
  }

  // Auto-scroll to the newest message, but only if the user was already
  // near the bottom - so scrolling up to read history isn't interrupted
  // by incoming messages.
  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom(messages.length <= 1 ? "auto" : "smooth");
    } else {
      setShowScrollButton(true);
    }
  }, [messages]);

  // Restore scroll position after older messages are prepended, so the
  // view doesn't jump when new content is added above what's visible.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || prevScrollHeightRef.current == null) return;

    el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
    prevScrollHeightRef.current = null;
  }, [messages]);

  useEffect(() => {
    // Jump to bottom instantly whenever the room changes.
    scrollToBottom("auto");
    setShowScrollButton(false);
    isNearBottomRef.current = true;
    prevScrollHeightRef.current = null;
  }, [activeRoomId]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 120;
    isNearBottomRef.current = nearBottom;
    setShowScrollButton(!nearBottom);

    if (el.scrollTop < 80 && hasMoreMessages && !loadingOlderMessages) {
      prevScrollHeightRef.current = el.scrollHeight;
      loadOlderMessages();
    }
  }

  if (messagesLoading) {
    return (
      <div className="flex-1">
        <Loader label="Loading messages..." className="py-10" />
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex-1 p-4">
        <ErrorMessage message={messagesError} onRetry={() => selectRoom(activeRoomId)} />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scroll-thin h-full space-y-3 overflow-y-auto px-4 py-4"
      >
        {loadingOlderMessages && (
          <p className="py-2 text-center text-xs text-mist-400">
            Loading earlier messages...
          </p>
        )}

        {!hasMoreMessages && messages.length > 0 && (
          <p className="py-2 text-center text-xs text-mist-500">
            Start of conversation
          </p>
        )}

        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-mist-300">
            No messages yet. Say hello to start the conversation.
          </p>
        )}

        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDivider = !previous || !isSameDay(previous.createdAt, message.createdAt);
          const showSenderName = !previous || previous.senderUsername !== message.senderUsername || showDivider;

          return (
            <div key={message.id || `${message.senderUsername}-${message.createdAt}-${index}`}>
              {showDivider && (
                <div className="my-3 flex items-center justify-center">
                  <span className="rounded-full bg-ink-800 px-3 py-1 text-[11px] font-medium text-mist-300">
                    {formatDayDivider(message.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble message={message} showSenderName={showSenderName} />
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom();
            setShowScrollButton(false);
          }}
          aria-label="Scroll to latest messages"
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-ink-700 bg-ink-800 text-mist-100 shadow-panel hover:bg-ink-700"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}