import React, { useState } from "react";
import { WhatsAppQRModal } from "./index";
import Icon from "./Icon";
import Button from "./Button";

const WhatsAppStatus = React.memo(({ showModal = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {showModal && (
          <Button
            onClick={handleOpenModal}
            variant="ghost"
            size="sm"
            className="text-xs">
            <Icon iconName="gear" size="xs" />
            <span>Configurar</span>
          </Button>
        )}
      </div>

      <WhatsAppQRModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
});

WhatsAppStatus.displayName = "WhatsAppStatus";

export default WhatsAppStatus;
