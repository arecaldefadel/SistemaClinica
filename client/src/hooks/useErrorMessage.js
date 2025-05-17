import { useState } from "react";

/** Ayuda a gestionar los mensajes de error. */
function useErrorMessage() {
  const [error, setError] = useState({
    state: false,
    msg: "",
  });

  const showMessage = (status, message) => {
    setError({
      state: status,
      msg: message,
    });
  };

  const hideMessage = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setError({ state: false, msg: "" });
        resolve(false);
      }, 5000);
    });
  };

  return { error, showMessage, hideMessage };
}

export default useErrorMessage;
