import { useEffect, useContext } from "react";
import { verifyToken } from "../pages/login/services/getUser";
import { useNavigate } from "react-router-dom";
import { PathContext } from "../context/PathContext";

/** Hook que controla la sesión del usuario, si expira vuelve a la pantalla de login */
function useSession() {
  const { setPath } = useContext(PathContext);

  useEffect(() => {
    setPath(window.location.hash.split("#")[1]);
  }, [setPath]);

  const navigate = useNavigate();
  useEffect(() => {
    Promise.all([verifyToken()]).then((res) => {
      const verifyResult = res[0];
      if (verifyResult.data?.error || verifyResult.error) {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);
}
export default useSession;
