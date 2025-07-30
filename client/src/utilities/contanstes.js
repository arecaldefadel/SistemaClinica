const API_CORE = "http://localhost:3002/api/v1";

export const ENDPOINTS = {
  LOGIN: `${API_CORE}/users/inicio`,
  LOGOUT: `${API_CORE}/users/logout`,
  REGISTER: `${API_CORE}/users/register`,
  ME: `${API_CORE}/users/me`,
  RESET_PASSWORD: `${API_CORE}/users/reset-password`,
  GET_USER: `${API_CORE}/users/get-user`,
  GET_USERS: `${API_CORE}/users/get-users`,
  UPDATE_USER: `${API_CORE}/users/update-user`,
  DELETE_USER: `${API_CORE}/users/delete-user`,
};
