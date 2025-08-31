import React, { useState, useMemo } from "react";
import {
  WhatsAppStatus,
  WhatsAppQRModal,
  Card,
  TitleContent,
} from "@/components/ui";
import { useWhatsApp } from "@/hooks/useWhatsApp";

const Configuracion = React.memo(() => {
  const { isConnected, isQrReady, loading } = useWhatsApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoizar los valores calculados para evitar recálculos
  const statusInfo = useMemo(
    () => ({
      connection: {
        label: "Estado de conexión:",
        value: isConnected ? "Conectado" : "Desconectado",
        className: isConnected
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800",
      },
      qr: {
        label: "Estado del QR:",
        value: isQrReady ? "Disponible" : "No disponible",
        className: isQrReady
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800",
      },
      loading: {
        label: "Cargando:",
        value: loading ? "Sí" : "No",
        className: loading
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800",
      },
    }),
    [isConnected, isQrReady, loading]
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <TitleContent title="Configuración del Sistema" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Estado de WhatsApp */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Estado de WhatsApp
            </h3>
            <WhatsAppStatus showModal={false} />
          </div>

          <div className="space-y-3">
            {Object.entries(statusInfo).map(([key, info]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {info.label}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${info.className}`}>
                  {info.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={handleOpenModal}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <span>Configurar Conexión WhatsApp</span>
            </button>
          </div>
        </Card>

        {/* Información del sistema */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Sistema
          </h3>

          <div className="space-y-3">
            {[
              { label: "Versión:", value: "1.0.0" },
              { label: "Entorno:", value: "Producción" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal de configuración de WhatsApp */}
      <WhatsAppQRModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
});

Configuracion.displayName = "Configuracion";

export default Configuracion;
