import { useState, useEffect } from "react";
import { getUserMenu } from "../pages/userAdmin/services/service.js";
function useUser(value) {
  const [user, setuser] = useState();
  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("keyToken");
    const jsonToken = JSON.parse(loggedUserToken);

    setuser(jsonToken);
    // Promise.all([getUserMenu(jsonToken?.id)]).then((res) => {
    //   const DatosUser = res[0];
    //   setuser(jsonToken);
    // });
  }, []);

  return user;
}

export default useUser;
