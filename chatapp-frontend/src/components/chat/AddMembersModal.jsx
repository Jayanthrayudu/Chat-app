import { useEffect, useState } from "react";
import { Search, UserPlus, X } from "lucide-react";
import * as usersService from "../../services/usersService";

export default function AddMembersModal({ activeRoom, onClose, onAdd, adding = false }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const existingIds = new Set(
    (activeRoom.participants || []).map((p) => p.id)
  );

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setError(null);

      try {
        const users = await usersService.searchUsers(trimmedQuery);
        const filtered = (Array.isArray(users) ? users : []).filter(
          (u) => !existingIds.has(u.id)
        );
        setSearchResults(filtered);
      } catch (err) {
        setSearchResults([]);
        setError(err?.response?.data?.message || "Could not search users.");
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  function isSelected(userId) {
    return selectedUsers.some((u) => u.id === userId);
  }

  function toggleUser(user) {
    if (isSelected(user.id)) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (selectedUsers.length === 0) {
      setError("Please select at least one member to add.");
      return;
    }

    setError(null);

    try {
      await onAdd(selectedUsers.map((u) => u.id));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add members.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-800 p-4">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-signal" />
            <h2 className="font-display text-lg font-semibold text-mist-50">Add members</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-mist-300 hover:bg-ink-800 hover:text-mist-50" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label htmlFor="add-member-search" className="mb-1.5 block text-sm font-medium text-mist-100">
              Search users
            </label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-300" />
              <input
                id="add-member-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by username"
                className="w-full rounded-lg border border-ink-700 bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-mist-50 placeholder:text-mist-300/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
          </div>

          {searching && <p className="text-sm text-mist-300">Searching users...</p>}

          {!searching && searchResults.length > 0 && (
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-ink-800 p-1">
              {searchResults.map((user) => {
                const selected = isSelected(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user)}
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${selected ? "bg-signal/20" : "hover:bg-ink-800"}`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-mist-50">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-mist-50">{user.username}</p>
                      {user.fullName && <p className="truncate text-xs text-mist-300">{user.fullName}</p>}
                    </div>
                    <span className={`text-xs ${selected ? "text-signal" : "text-mist-300"}`}>
                      {selected ? "Selected" : "Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!searching && query.trim() && searchResults.length === 0 && (
            <p className="text-sm text-mist-300">No users found.</p>
          )}

          {selectedUsers.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-300">
                Selected ({selectedUsers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <span key={user.id} className="flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1.5 text-xs text-mist-100">
                    {user.username}
                    <button type="button" onClick={() => toggleUser(user)} className="text-mist-300 hover:text-mist-50" aria-label={`Remove ${user.username}`}>
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-ink-800 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-mist-300 hover:bg-ink-800 hover:text-mist-50">
              Cancel
            </button>
            <button type="submit" disabled={adding} className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              <UserPlus size={16} />
              {adding ? "Adding..." : "Add members"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}