import api from "./api";

/**
 * GET /api/messages/{chatRoomId}
 * Returns an array of MessageResponse objects.
 */
// export async function getMessages(chatRoomId) {
//   const response = await api.get(`/messages/${chatRoomId}`);
//   return response.data;
// }

/**
 * POST /api/messages/{chatRoomId}
 * Body: { content, messageType }
 * NOTE: never include senderId / senderUsername - the backend derives the
 * sender from the authenticated JWT principal.
 */
export async function sendMessageRest(chatRoomId, content, messageType = "TEXT") {
  const response = await api.post(`/messages/${chatRoomId}`, {
    content,
    messageType,
  });
  return response.data;
}

/**
 * PUT /api/messages/{messageId}
 * Body: { content, messageType }
 */
export async function updateMessage(messageId, content, messageType = "TEXT") {
  const response = await api.put(`/messages/${messageId}`, {
    content,
    messageType,
  });
  return response.data;
}

/**
 * DELETE /api/messages/{messageId}
 */
export async function deleteMessage(messageId) {
  await api.delete(`/messages/${messageId}`);
}

/**
 * GET /api/messages/{chatRoomId}?page=X&size=Y
 * Returns a paginated object: { content, totalPages, last, number, ... }
 */
export async function getMessages(chatRoomId, page = 0, size = 30) {
  const response = await api.get(
    `/messages/${chatRoomId}?page=${page}&size=${size}`
  );
  return response.data;
}