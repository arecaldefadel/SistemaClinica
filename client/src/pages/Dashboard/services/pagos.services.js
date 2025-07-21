import api from "@/utilities/apiClient";

export const getResumenPagos = async ({
  page = 1,
  pageSize = 10,
  paramsFilter,
}) => {
  try {
    const res = await api.get("/pagos/resumen", {
      params: { page, pageSize, paramsFilter },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};

export const getHistorialPagos = async ({
  id,
  page = 1,
  pageSize = 10,
  paramsFilter,
}) => {
  try {
    const res = await api.get(`/pagos/historial/${id}`, {
      params: { page, pageSize, paramsFilter },
    });
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};

export const getEstadosPago = async () => {
  try {
    const res = await api.get("/pagos/estadosPago", {});
    return res.data;
  } catch (err) {
    console.error("Error al obtener pacientes:", err.message);
    throw err;
  }
};

export const addPagos = async (data) => {
  try {
    const res = await api.post("/pagos", data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const updatePagos = async (id, data) => {
  try {
    const res = await api.put(`/pagos/${id}`, data);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};

export const deletePago = async (id) => {
  try {
    const res = await api.delete(`/pagos/${id}`);
    return res;
  } catch (err) {
    console.error("Error:", err.response.data.message);
    return err.response.data;
  }
};
