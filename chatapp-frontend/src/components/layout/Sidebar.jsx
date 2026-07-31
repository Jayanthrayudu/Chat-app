import { useState } from "react";
import { Users, Info, Trash2, UserPlus, LogOut, X } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { getRoomDisplayName, getRoomDisplayInitial } from "../../utils/privateChatUtils";
import AddMembersModal from "../chat/AddMembersModal";

export default function Sidebar({ isOpenMobile = false, onCloseMobile }) {
  const { activeRoom, deleteRoom, addMembers, leaveGroup, removeMember } = useChat();
  const { user } = useAuth();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);

  if (!activeRoom) {
    return (
      <aside className="hidden w-72 shrink-0 border-l border-ink-800 bg-ink-900 p-4 lg:block">
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-mist-300">
          <Info size={22} />
          <p className="text-sm">Select a conversation to see room details.</p>
        </div>
      </aside>
    );
  }

  const displayName = getRoomDisplayName(activeRoom, user);
  const initial = getRoomDisplayInitial(activeRoom, user);
  const isCreator = activeRoom.creatorUsername === user?.username;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteRoom(activeRoom.id);
    } catch (err) {
      console.error("Failed to delete room:", err);
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  async function handleLeave() {
    setLeaving(true);
    try {
      await leaveGroup(activeRoom.id);
    } catch (err) {
      console.error("Failed to leave group:", err);
      setLeaving(false);
      setConfirmingLeave(false);
    }
  }

  async function handleRemoveMember(userId) {
    setRemovingUserId(userId);
    try {
      await removeMember(activeRoom.id, userId);
    } catch (err) {
      console.error("Failed to remove member:", err);
    } finally {
      setRemovingUserId(null);
    }
  }

  async function handleAddMembers(userIds) {
    setAdding(true);
    try {
      await addMembers(activeRoom.id, userIds);
      setShowAddMembers(false);
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          ${isOpenMobile ? "fixed inset-y-0 right-0 z-40 flex w-72" : "hidden"}
          flex-col overflow-y-auto border-l border-ink-800 bg-ink-900 p-4 scroll-thin
          lg:static lg:z-auto lg:flex lg:w-72 lg:shrink-0
        `}
      >
        <div className="mb-2 flex items-center justify-between lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-300">
            Conversation info
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close"
            className="rounded-md p-1.5 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 border-b border-ink-800 pb-5 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: activeRoom.avatarColor || "#3E63DD" }}
          >
            {initial}
          </div>
          <h3 className="font-display text-base font-semibold text-mist-50">{displayName}</h3>
          <p className="text-xs text-mist-300">{activeRoom.isGroup ? "Group conversation" : "Direct message"}</p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-300">
              <Users size={13} />
              Members ({activeRoom.participants?.length || 0})
            </h4>

            {activeRoom.isGroup && isCreator && (
              <button
                type="button"
                onClick={() => setShowAddMembers(true)}
                className="rounded-md p-1 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
                aria-label="Add members"
              >
                <UserPlus size={14} />
              </button>
            )}
          </div>

          <ul className="space-y-1.5">
            {(activeRoom.participants || []).map((p) => {
              const isThisCreator = p.username === activeRoom.creatorUsername;
              const canRemove = activeRoom.isGroup && isCreator && !isThisCreator;

              return (
                <li key={p.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-800">
                  <span className={`h-2 w-2 rounded-full ${p.online ? "bg-emerald-400" : "bg-ink-600"}`} />
                  <span className="flex-1 text-sm text-mist-100">{p.username}</span>

                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(p.id)}
                      disabled={removingUserId === p.id}
                      aria-label={`Remove ${p.username}`}
                      className="rounded-md p-1 text-mist-400 hover:bg-red-950/40 hover:text-red-400 disabled:opacity-50"
                    >
                      <X size={13} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {activeRoom.isGroup && !isCreator && (
          <div className="mt-6 border-t border-ink-800 pt-4">
            {!confirmingLeave ? (
              <button
                type="button"
                onClick={() => setConfirmingLeave(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink-700 px-3 py-2 text-sm font-medium text-mist-200 hover:bg-ink-800"
              >
                <LogOut size={15} />
                Leave group
              </button>
            ) : (
              <div className="space-y-2 rounded-lg border border-ink-700 bg-ink-800/50 p-3">
                <p className="text-xs text-mist-200">
                  You'll need to be re-added to rejoin this group.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleLeave}
                    disabled={leaving}
                    className="flex-1 rounded-lg bg-ink-700 px-3 py-1.5 text-xs font-semibold text-mist-50 hover:bg-ink-600 disabled:opacity-50"
                  >
                    {leaving ? "Leaving..." : "Confirm leave"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingLeave(false)}
                    disabled={leaving}
                    className="flex-1 rounded-lg border border-ink-700 px-3 py-1.5 text-xs font-medium text-mist-200 hover:bg-ink-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeRoom.isGroup && isCreator && (
          <div className="mt-6 border-t border-ink-800 pt-4">
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/40 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30"
              >
                <Trash2 size={15} />
                Delete group
              </button>
            ) : (
              <div className="space-y-2 rounded-lg border border-red-900/40 bg-red-950/20 p-3">
                <p className="text-xs text-mist-200">
                  This permanently deletes the group and all its messages for everyone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Confirm delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                    className="flex-1 rounded-lg border border-ink-700 px-3 py-1.5 text-xs font-medium text-mist-200 hover:bg-ink-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showAddMembers && (
          <AddMembersModal
            activeRoom={activeRoom}
            onClose={() => setShowAddMembers(false)}
            onAdd={handleAddMembers}
            adding={adding}
          />
        )}
      </aside>
    </>
  );
}