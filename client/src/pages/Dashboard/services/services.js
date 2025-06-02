//servicios del módulo.
import api from "@/utilities/apiClient";

export const getPacientes = async ({
  page = 1,
  pageSize = 10,
  paramsFilter,
}) => {
  try {
    const res = await api.get("/pacientes", {
      params: { page, pageSize, paramsFilter },
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

export const deletePaciente = async (data) => {
  try {
    const res = await api.delete(`/pacientes/${data.id}`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const reactivePaciente = async (data) => {
  try {
    const res = await api.put(`/pacientes/${data.id}/reactive`);
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
