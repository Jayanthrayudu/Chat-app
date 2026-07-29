import api from "./api";

export async function searchUsers(
  username
) {
  const response =
    await api.get(
      "/users/search",
      {
        params: {
          username: username.trim(),
        },
      }
    );

  return response.data;
}