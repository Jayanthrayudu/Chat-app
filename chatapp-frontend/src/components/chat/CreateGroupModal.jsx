import { useEffect, useState } from "react";

import {
  Search,
  Users,
  UserPlus,
  X,
} from "lucide-react";

import * as usersService from "../../services/usersService";

export default function CreateGroupModal({
  onClose,
  onCreate,
  creating = false,
}) {
  const [
    groupName,
    setGroupName,
  ] = useState("");

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    selectedUsers,
    setSelectedUsers,
  ] = useState([]);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(null);

  useEffect(() => {
    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearching(false);

      return;
    }

    const timer =
      setTimeout(
        async () => {
          setSearching(true);
          setError(null);

          try {
            const users =
              await usersService.searchUsers(
                trimmedQuery
              );

            setSearchResults(
              Array.isArray(users)
                ? users
                : []
            );
          } catch (err) {
            setSearchResults([]);

            setError(
              err?.response?.data
                ?.message ||
                "Could not search users."
            );
          } finally {
            setSearching(false);
          }
        },
        350
      );

    return () =>
      clearTimeout(timer);
  }, [query]);

  function isSelected(userId) {
    return selectedUsers.some(
      (user) =>
        user.id === userId
    );
  }

  function toggleUser(user) {
    if (isSelected(user.id)) {
      setSelectedUsers(
        (previousUsers) =>
          previousUsers.filter(
            (selectedUser) =>
              selectedUser.id !==
              user.id
          )
      );

      return;
    }

    setSelectedUsers(
      (previousUsers) => [
        ...previousUsers,
        user,
      ]
    );
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const trimmedGroupName =
      groupName.trim();

    if (!trimmedGroupName) {
      setError(
        "Please enter a group name."
      );

      return;
    }

    if (
      selectedUsers.length === 0
    ) {
      setError(
        "Please select at least one member."
      );

      return;
    }

    setError(null);

    try {
      await onCreate(
        trimmedGroupName,
        selectedUsers.map(
          (user) => user.id
        )
      );
    } catch (err) {
      setError(
        err?.response?.data
          ?.message ||
          "Could not create group."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-800 p-4">
          <div className="flex items-center gap-2">
            <Users
              size={20}
              className="text-signal"
            />

            <h2 className="font-display text-lg font-semibold text-mist-50">
              Create New Group
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4"
        >
          <div>
            <label
              htmlFor="group-name"
              className="mb-1.5 block text-sm font-medium text-mist-100"
            >
              Group name
            </label>

            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(event) =>
                setGroupName(
                  event.target.value
                )
              }
              placeholder="e.g. Development Team"
              className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3 py-2.5 text-sm text-mist-50 placeholder:text-mist-300/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>

          <div>
            <label
              htmlFor="user-search"
              className="mb-1.5 block text-sm font-medium text-mist-100"
            >
              Add members
            </label>

            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-300"
              />

              <input
                id="user-search"
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search by username"
                className="w-full rounded-lg border border-ink-700 bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-mist-50 placeholder:text-mist-300/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
          </div>

          {searching && (
            <p className="text-sm text-mist-300">
              Searching users...
            </p>
          )}

          {!searching &&
            searchResults.length > 0 && (
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-ink-800 p-1">
                {searchResults.map(
                  (user) => {
                    const selected =
                      isSelected(
                        user.id
                      );

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                          toggleUser(
                            user
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                          selected
                            ? "bg-signal/20"
                            : "hover:bg-ink-800"
                        }`}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-mist-50">
                          {user.username
                            ?.charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-mist-50">
                            {user.username}
                          </p>

                          {user.fullName && (
                            <p className="truncate text-xs text-mist-300">
                              {
                                user.fullName
                              }
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-xs ${
                            selected
                              ? "text-signal"
                              : "text-mist-300"
                          }`}
                        >
                          {selected
                            ? "Selected"
                            : "Add"}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}

          {!searching &&
            query.trim() &&
            searchResults.length ===
              0 && (
              <p className="text-sm text-mist-300">
                No users found.
              </p>
            )}

          {selectedUsers.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-300">
                Selected members (
                {selectedUsers.length}
                )
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(
                  (user) => (
                    <span
                      key={user.id}
                      className="flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1.5 text-xs text-mist-100"
                    >
                      {user.username}

                      <button
                        type="button"
                        onClick={() =>
                          toggleUser(
                            user
                          )
                        }
                        className="text-mist-300 hover:text-mist-50"
                        aria-label={`Remove ${user.username}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-ink-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-mist-300 hover:bg-ink-800 hover:text-mist-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus size={16} />

              {creating
                ? "Creating..."
                : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}