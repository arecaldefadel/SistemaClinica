import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/utilities/auth";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

/** Hook que controla la sesión del usuario, si expira vuelve a la pantalla de login */
function useSession() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([validateToken()]).then((res) => {
      const verifyResult = res[0];
      if (!verifyResult) {
        showToast({
          message: "⚠️ Tu sesión expiró. Por favor, iniciá sesión nuevamente.",
          type: "error",
        });
        // // Si la sesión ha expirado, se cierra la sesión y se redirige a la página de login
        setTimeout(() => {
          // Cerrar sesión
          logout();
          navigate("/login", { replace: true });
        }, 3000);
      }
    });
  }, []);
}
export default useSession;
