const API_CORE = "http://localhost:3002/api/v1";

export const ENDPOINTS = {
  LOGIN: `${API_CORE}/auth/login`,
  LOGOUT: `${API_CORE}/auth/logout`,
  REGISTER: `${API_CORE}/auth/register`,
  RESET_PASSWORD: `/auth/reset-password`,
  GET_USER: `${API_CORE}/user/get-user`,
  GET_USERS: `${API_CORE}/user/get-users`,
  UPDATE_USER: `${API_CORE}/user/update-user`,
  DELETE_USER: `${API_CORE}/user/delete-user`,
};
