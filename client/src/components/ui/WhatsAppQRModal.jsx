import React, { useEffect, useState, useMemo } from "react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";
import Spiner from "./Spiner";

const WhatsAppQRModal = React.memo(({ isOpen, onClose }) => {
  const {
    qrCode,
    status,
    loading,
    error,
    reconnect,
    logout,
    restart,
    isConnected,
    isQrReady,
    isDisconnected,
  } = useWhatsApp();

  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  // Generar imagen del QR cuando esté disponible
  useEffect(() => {
    if (qrCode) {
      // Crear una imagen del QR usando la librería qrcode
      import("qrcode").then((QRCode) => {
        QRCode.toDataURL(qrCode, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
          .then((url) => {
            setQrImageUrl(url);
          })
          .catch((err) => {
            console.error("Error generando QR:", err);
          });
      });
    } else {
      setQrImageUrl(null);
    }
  }, [qrCode]);

  // Memoizar los valores calculados para evitar recálculos
  const statusInfo = useMemo(() => {
    let icon, text, color;

    switch (status) {
      case "connected":
        icon = "check-circle";
        text = "WhatsApp conectado exitosamente";
        color = "text-green-600";
        break;
      case "qr_ready":
        icon = "qrcode";
        text = "Escanea el código QR con tu WhatsApp";
        color = "text-blue-600";
        break;
      case "loading":
        icon = "spinner";
        text = "Conectando con WhatsApp...";
        color = "text-yellow-600";
        break;
      case "error":
      case "auth_failed":
        icon = "exclamation-triangle";
        text =
          status === "error"
            ? "Error de conexión"
            : "Fallo en la autenticación";
        color = "text-red-600";
        break;
      default:
        icon = "wifi";
        text = "WhatsApp desconectado";
        color = "text-gray-600";
    }

    return { icon, text, color };
  }, [status]);

  const handleReconnect = () => {
    reconnect();
  };

  const handleLogout = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres cerrar sesión de WhatsApp?")
    ) {
      setIsLoggingOut(true);
      try {
        const result = await logout();
        if (result.success) {
          console.log("Logout exitoso");
        }
      } catch (error) {
        console.error("Error en logout:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleRestart = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres reiniciar WhatsApp? Esto cerrará la sesión actual."
      )
    ) {
      setIsRestarting(true);
      try {
        const result = await restart();
        if (result.success) {
          console.log("Reinicio exitoso");
        }
      } catch (error) {
        console.error("Error en restart:", error);
      } finally {
        setIsRestarting(false);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Estado de WhatsApp
          </h2>
        </div>

        {/* Estado actual */}
        {/* <div className="mb-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon
              iconName={statusInfo?.icon || "wifi"}
              size="lg"
              className={`${statusInfo?.color || "text-gray-600"} ${
                status === "loading" ? "animate-spin" : ""
              }`}
            />
            <div>
              <p
                className={`font-medium ${
                  statusInfo?.color || "text-gray-600"
                }`}>
                {statusInfo?.text || "WhatsApp desconectado"}
              </p>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
          </div>
        </div> */}

        {/* QR Code */}
        {isQrReady && qrImageUrl && (
          <div className=" text-center">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
              <img
                src={qrImageUrl}
                alt="Código QR de WhatsApp"
                className="w-64 h-64 mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              📱 Abre WhatsApp en tu teléfono y escanea este código
            </p>
          </div>
        )}

        {/* Estado conectado */}
        {isConnected && (
          <div className="mb-6 text-center p-4 bg-green-50 rounded-lg">
            <Icon
              iconName="check-circle"
              size="2xl"
              className="text-green-600 mb-2"
            />
            <p className="text-green-800 font-medium">
              ¡WhatsApp está conectado y funcionando!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Puedes cerrar este modal y usar las notificaciones
            </p>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="mb-6 text-center p-4 bg-yellow-50 rounded-lg">
            <Spiner size="lg" className="text-yellow-600 mb-2" />
            <p className="text-yellow-800 font-medium">
              Conectando con WhatsApp...
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Por favor espera mientras se establece la conexión
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          {isConnected && (
            <>
              <Button
                onClick={handleLogout}
                variant="danger"
                disabled={isLoggingOut}
                className="flex items-center space-x-2">
                {isLoggingOut ? (
                  <Spiner size="sm" />
                ) : (
                  <Icon iconName="sign-out-alt" size="sm" />
                )}
                <span>{isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}</span>
              </Button>

              <Button
                onClick={handleRestart}
                variant="warning"
                disabled={isRestarting}
                className="flex items-center space-x-2">
                {isRestarting ? (
                  <Spiner size="sm" />
                ) : (
                  <Icon iconName="refresh" size="sm" />
                )}
                <span>{isRestarting ? "Reiniciando..." : "Reiniciar"}</span>
              </Button>
            </>
          )}

          {isDisconnected && (
            <Button
              onClick={handleReconnect}
              variant="secondary"
              className="flex items-center space-x-2">
              <Icon iconName="refresh" size="sm" />
              <span>Reconectar</span>
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon
              iconName="info-circle"
              size="sm"
              className="text-blue-600 mt-0.5"
            />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Información importante:</p>
              <ul className="mt-1 space-y-1">
                <li>• El QR se actualiza cada minuto por seguridad</li>
                <li>• Mantén tu teléfono conectado a internet</li>
                <li>• No cierres WhatsApp Web en tu teléfono</li>
                <li>• La conexión se mantiene activa automáticamente</li>
                <li>• Usa "Cerrar Sesión" para desconectar completamente</li>
                <li>• Usa "Reiniciar" si hay problemas de conexión</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

WhatsAppQRModal.displayName = "WhatsAppQRModal";

export default WhatsAppQRModal;
