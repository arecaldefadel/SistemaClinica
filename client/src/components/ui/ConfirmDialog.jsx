import React from "react";
import { Modal, Button } from "@/components/ui";

const ConfirmDialog = ({
  open = false,
  title = "¿Confirmar acción?",
  message = "¿Estás seguro de que querés continuar?",
  onConfirm = () => {},
  onCancel = () => {},
}) => {

 return (
    <Modal isOpen={open} onClose={onCancel} title={title} >
        <p className="text-sm text-muted mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="danger" onClick={onCancel} title="Cancelar">
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            title="Aceptar"
          >
          </Button>
        </div>
    </Modal>
  );
};

export default ConfirmDialog;
