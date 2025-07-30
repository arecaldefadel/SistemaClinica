import axios from "axios";
import { ENDPOINTS } from "@/utilities/contanstes.js";

export const api = {
  login: async (user, pass) =>
    axios
      .post(ENDPOINTS.LOGIN, { user, pass })
      .then((r) => r.data)
      .catch((e) => e?.response),
  getUserById: async (id) =>
    axios
      .get(`${ENDPOINTS.GET_USER}/${id}`)
      .then((r) => r.data)
      .catch((e) => e?.response),
  updateUser: async (id, payload) =>
    axios
      .put(`${ENDPOINTS.users}/${id}`, payload)
      .then((r) => r.data)
      .catch((e) => e?.response),
  changePassword: async (payload) => {
    return axios
      .put(ENDPOINTS.RESET_PASSWORD, payload)
      .then((r) => r.data)
      .catch((e) => e?.response);
  },
};
