import api from "@/utilities/apiClient";
// ======================================================
export const getTurnos = async ({ page, pageSize, paramsFilter }) => {
  try {
    const res = await api.get("/turnos", {
      params: { page, pageSize, paramsFilter },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};

export const getTurnosPorMes = async ({ paramsFilter }) => {
  try {
    const res = await api.get("/turnos/porMes", {
      params: { paramsFilter },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};
export const addTurno = async (data) => {
  try {
    const res = await api.post("/turnos", data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const updateTurno = async (data) => {
  try {
    const res = await api.put(`/turnos/${data.id}`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const deleteTurno = async (data) => {
  try {
    const res = await api.delete(`/turnos/${data.id}`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const setTurnoAtendido = async (data) => {
  try {
    const res = await api.put(`/turnos/${data.id}/atendido`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const getStats = async () => {
  try {
    const res = await api.get("/turnos/stats");
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};
