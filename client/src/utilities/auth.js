import axios from "axios";
import { ENDPOINTS } from "@/utilities/contanstes.js";

export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await axios.get(ENDPOINTS.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status === 200; // válido
  } catch (error) {
    console.error("Error validando token:", error.message);
    return false; // inválido o expirado
  }
};
