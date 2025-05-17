import axios from "axios";
import { ENDPOINTS } from "@/utilities/contanstes.js";

export const api = {
  login: (user, pass) =>
    axios
      .post(ENDPOINTS.LOGIN, { user, pass })
      .then((r) => r.data)
      .catch((e) => e?.response),
  getUserById: (id) =>
    axios
      .get(`${ENDPOINTS.GET_USER}/${id}`)
      .then((r) => r.data)
      .catch((e) => e?.response),
  updateUser: (id, payload) =>
    axios
      .put(`${ENDPOINTS.users}/${id}`, payload)
      .then((r) => r.data)
      .catch((e) => e?.response),
};
