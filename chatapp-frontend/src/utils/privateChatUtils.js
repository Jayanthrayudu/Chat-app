export function getOtherParticipant(room, currentUser) {
  if (!room || room.isGroup) {
    return null;
  }

  const participants = room.participants || [];

  if (!participants.length) {
    return null;
  }

  const currentUserId = currentUser?.id;
  const currentUsername = currentUser?.username;

  const otherParticipant = participants.find(
    (participant) => {
      const sameId =
        currentUserId &&
        participant.id === currentUserId;

      const sameUsername =
        currentUsername &&
        participant.username === currentUsername;

      return !sameId && !sameUsername;
    }
  );

  return otherParticipant || null;
}

export function getRoomDisplayName(room, currentUser) {
  if (!room) {
    return "Unknown user";
  }

  if (room.isGroup) {
    return room.name || "Group Chat";
  }

  const otherParticipant = getOtherParticipant(room, currentUser);

  return (
    otherParticipant?.fullName ||
    otherParticipant?.username ||
    "Unknown user"
  );
}

export function getRoomDisplayInitial(
  room,
  currentUser
) {
  const displayName =
    getRoomDisplayName(
      room,
      currentUser
    );

  return displayName
    .charAt(0)
    .toUpperCase();
}