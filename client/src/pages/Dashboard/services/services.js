//servicios del módulo.
import api from "@/utilities/apiClient";

export const getPacientes = async ({ page = 1, pageSize = 10 }) => {
  try {
    const res = await api.get("/pacientes", {
      params: { page, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};
