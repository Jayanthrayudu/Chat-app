import { useState } from "react";
import { Check, CheckCheck, Clock, X } from "lucide-react";
import { formatMessageTime } from "../../utils/dateUtils";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import MessageActions from "./MessageActions";
import Modal from "../common/Modal";

const STATUS_ICON = {
  SENT: Check,
  DELIVERED: CheckCheck,
  READ: CheckCheck,
  PENDING: Clock,
};

export default function MessageBubble({ message, showSenderName }) {
  const { user } = useAuth();
  const { editMessage, removeMessage } = useChat();

  const isOwn = user?.username && message.senderUsername === user.username;
  const StatusIcon = STATUS_ICON[message.status] || Check;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveEdit() {
    if (!draft.trim() || draft.trim() === message.content) {
      setIsEditing(false);
      setDraft(message.content);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await editMessage(message.id, draft.trim());
      setIsEditing(false);
    } catch {
      setError("Couldn't save your edit. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await removeMessage(message.id);
      setConfirmDeleteOpen(false);
    } catch {
      setError("Couldn't delete this message.");
      setDeleting(false);
    }
  }

  return (
    <div className={`group flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex max-w-[78%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {showSenderName && !isOwn && (
          <span className="mb-1 px-1 text-xs font-medium text-mist-300">{message.senderUsername}</span>
        )}

        <div className="flex items-center gap-1.5">
          {isOwn && !isEditing && (
            <MessageActions
              className="opacity-0 transition group-hover:opacity-100"
              onEdit={() => setIsEditing(true)}
              onDelete={() => setConfirmDeleteOpen(true)}
            />
          )}

          <div
            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
              isOwn
                ? "rounded-br-md bg-signal text-white"
                : "rounded-bl-md border border-ink-700 bg-ink-800 text-mist-50"
            }`}
          >
            {isEditing ? (
              <div className="min-w-[180px]">
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none placeholder:text-white/50"
                />
                <div className="mt-1.5 flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setDraft(message.content);
                    }}
                    className="rounded-md p-1 hover:bg-white/10"
                    aria-label="Cancel edit"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="rounded-md p-1 hover:bg-white/10 disabled:opacity-50"
                    aria-label="Save edit"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
        </div>

        <div className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-mist-300 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwn && <StatusIcon size={12} />}
          {message.editedAt && <span className="italic">edited</span>}
        </div>

        {error && <p className="mt-1 px-1 text-[11px] text-red-400">{error}</p>}
      </div>

      <Modal open={confirmDeleteOpen} title="Delete message?" onClose={() => setConfirmDeleteOpen(false)}>
        <p className="mb-4 text-sm text-mist-200">
          This will permanently delete this message. This action can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(false)}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-mist-200 hover:bg-ink-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
