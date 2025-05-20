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

export const addPaciente = async (data) => {
  try {
    const res = await api.post("/pacientes", data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const updatePaciente = async (data) => {
  try {
    const res = await api.put(`/pacientes/${data.id}`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const getObrasSociales = async ({ page, pageSize, paramsFilter }) => {
  try {
    const res = await api.get("/pacientes/obras-sociales", {
      params: { page, pageSize, paramsFilter },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};
