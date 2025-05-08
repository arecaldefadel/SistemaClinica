import "./App.css";
import { lazy } from "react";
import {
  Route,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import Home from "@/pages/Home";
import Default from "@/pages/Default";
import Layout from "@/components/ui/Layout";

import Playground from "@/pages/Playground";

// ===========================================================
// Configuración global para importar íconos de forma dinámica.
const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => Icons[icon]);
library.add(...iconList);
// ===========================================================
const menu = [{
  "CODIGO": "1",
  "PATHNAME": "dashboard",
  "PATH": "./pages/Dashboard",
  "DESCRIPCION": "Dashboard",
  "VISIBLE": 1,
  "ICONO": "home",
  "MENU": "1"
},
{
  "CODIGO": "2",
  "PATHNAME": "pacientes",
  "PATH": "./pages/Dashboard/views/Pacientes",
  "DESCRIPCION": "Pacientes",
  "VISIBLE": 1,
  "ICONO": "user",
  "MENU": "1"
},]

// Genero un lista de rutas con para la config del usuario.
const arrayRutas = menu.map((ruta) => {
  const ElementMenu = lazy(() =>
    import(`${ruta.PATH}`).catch(
      (err) => {
        console.error("Error al cargar el componente:", err);
        return { default: Default };
      }
    )
  );

  const contieneID = ruta.PATHNAME.search(":id");

  if (contieneID !== -1) {
    return (
      <Route
        key={ruta.PATHNAME}
        path={ruta.PATHNAME}
        element={<ElementMenu />}
        errorElement={<Default />}
        action={async ({ request }) => {
          let formData = await request.formData();
          return { data: formData.get("data") };
        }}></Route>
    );
  }

  return (
    <Route
      key={ruta.PATHNAME}
      path={ruta.PATHNAME}
      element={<ElementMenu />}
      errorElement={<Default />}></Route>
  );
});


const router = createHashRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={<Layout  menuUser={menu}/>}
        errorElement={<Default />}
      >
        {arrayRutas}
      </Route>
      <Route path="/playground" element={<Playground />} />
      <Route path="/" element={<Home />}></Route>
      <Route path="*" element={<Default />}></Route>
    </Route>
  )
);

export default router;
