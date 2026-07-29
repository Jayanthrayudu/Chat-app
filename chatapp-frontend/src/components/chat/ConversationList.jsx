import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { useChat } from "../../hooks/useChat";
import * as userService from "../../services/usersService";

import ConversationItem from "./ConversationItem";
import UserSearchItem from "./UserSearchItem";
import CreateGroupModal from "./CreateGroupModal";

import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

export default function ConversationList({ onSelect, className = "" }) {
  const {
    rooms,
    roomsLoading,
    roomsError,
    reloadRooms,
    activeRoomId,
    selectRoom,
    createGroup,
    creatingRoom,
    openPrivateChat,
  } = useChat();

  const [query, setQuery] = useState("");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // =========================
  // SEARCH USERS
  // =========================

  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) {
      setSearchUsers([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const users = await userService.searchUsers(searchQuery);
        setSearchUsers(users);
      } catch (error) {
        setSearchUsers([]);
        setSearchError(
          error?.response?.data?.message || "Could not search users."
        );
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  // =========================
  // FILTER ROOMS
  // =========================

  const filteredRooms = useMemo(() => {
    if (!query.trim()) {
      return rooms;
    }

    return [];
  }, [rooms, query]);

  // =========================
  // SELECT EXISTING ROOM
  // =========================

  function handleSelect(roomId) {
    selectRoom(roomId);

    if (onSelect) {
      onSelect(roomId);
    }
  }

  // =========================
  // OPEN PRIVATE CHAT
  // =========================

  async function handleUserSelect(user) {
    try {
      const room = await openPrivateChat(user.id);

      setQuery("");
      setSearchUsers([]);

      if (room?.id) {
        handleSelect(room.id);
      }
    } catch (error) {
      console.error("Failed to open private chat:", error);
    }
  }

  // =========================
  // CREATE GROUP
  // =========================

  async function handleCreateGroup(name, participantIds) {
    try {
      const newRoom = await createGroup(name, participantIds);

      setShowCreateGroupModal(false);

      if (newRoom?.id) {
        handleSelect(newRoom.id);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  }

  const isSearching = query.trim().length > 0;

  return (
    <>
      <div className={`flex h-full flex-col ${className}`}>
        {/* =========================
            HEADER
        ========================= */}

        <div className="shrink-0 p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-mist-50">
              Conversations
            </h2>

            <button
              type="button"
              onClick={() => setShowCreateGroupModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-signal px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
            >
              <Plus size={15} />
              <span>Group</span>
            </button>
          </div>

          {/* =========================
              SEARCH INPUT
          ========================= */}

          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-300"
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users to chat"
              aria-label="Search users to chat"
              className="w-full rounded-lg border border-ink-700 bg-ink-800 py-2 pl-9 pr-3 text-sm text-mist-50 placeholder:text-mist-300/50 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
        </div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="flex-1 overflow-y-auto px-2 pb-3 scroll-thin">
          {/* =========================
              USER SEARCH RESULTS
          ========================= */}

          {isSearching && (
            <>
              {searchLoading && (
                <Loader label="Searching users..." className="py-8" />
              )}

              {!searchLoading && searchError && (
                <ErrorMessage message={searchError} className="mx-1" />
              )}

              {!searchLoading &&
                !searchError &&
                searchUsers.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-mist-300">
                    No users found.
                  </p>
                )}

              {!searchLoading &&
                !searchError &&
                searchUsers.length > 0 && (
                  <div className="space-y-1">
                    {searchUsers.map((user) => (
                      <UserSearchItem
                        key={user.id}
                        user={user}
                        onClick={() => handleUserSelect(user)}
                      />
                    ))}
                  </div>
                )}
            </>
          )}

          {/* =========================
              NORMAL CONVERSATIONS
          ========================= */}

          {!isSearching && (
            <>
              {roomsLoading && (
                <Loader label="Loading conversations..." className="py-8" />
              )}

              {!roomsLoading && roomsError && (
                <ErrorMessage
                  message={roomsError}
                  onRetry={reloadRooms}
                  className="mx-1"
                />
              )}

              {!roomsLoading &&
                !roomsError &&
                filteredRooms.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-mist-300">
                    No conversations yet.
                  </p>
                )}

              <div className="space-y-1">
                {filteredRooms.map((room) => (
                  <ConversationItem
                    key={room.id}
                    room={room}
                    active={room.id === activeRoomId}
                    onClick={() => handleSelect(room.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =========================
          CREATE GROUP MODAL
      ========================= */}

      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onCreate={handleCreateGroup}
          creating={creatingRoom}
        />
      )}
    </>
  );
}