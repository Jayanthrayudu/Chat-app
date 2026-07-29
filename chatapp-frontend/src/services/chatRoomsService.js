import api from "./api";

export async function getRooms() {
  const response = await api.get("/chat-rooms");

  return response.data;
}

export async function getRoomById(roomId) {
  const response = await api.get(`/chat-rooms/${roomId}`);

  return response.data;
}

export async function createRoom(name, isGroup, participantIds) {
  const response = await api.post("/chat-rooms", {
    name,
    isGroup,
    participantIds,
  });

  return response.data;
}

export async function deleteRoom(roomId) {
  await api.delete(`/chat-rooms/${roomId}`);
}


export async function createOrGetPrivateChat(userId) {
  if (!userId) {
    throw new Error("User ID is required to create a private chat");
  }

  const response = await api.post(`/chat-rooms/private/${userId}`);

  return response.data;
}

export async function addParticipants(roomId, userIds) {
  const response = await api.post(`/chat-rooms/${roomId}/participants`, userIds);
  return response.data;
}

export async function leaveGroup(roomId) {
  const response = await api.delete(`/chat-rooms/${roomId}/leave`);
  return response.data;
}

export async function removeMember(roomId, userId) {
  const response = await api.delete(`/chat-rooms/${roomId}/participants/${userId}`);
  return response.data;
}