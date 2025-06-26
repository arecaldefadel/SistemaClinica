import "./App.css";
import { lazy } from "react";
import {
  Route,
  createRoutesFromElements,
  createHashRouter,
} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import settiongs from './settings.json'
import Default from "@/pages/Default";
import Layout from "@/components/ui/Layout";
import Playground from "@/pages/Playground";
import LogIn from "./pages/User";
import PrivateRoute from '@/components/router/PrivateRoute';
import  { menuComponentsMap }  from '@/menuComponentsMap.js';

// ===========================================================
// Configuración global para importar íconos de forma dinámica.
const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => Icons[icon]);
library.add(...iconList);
// ===========================================================
const menu = settiongs.menu
// Genero un lista de rutas con para la config del usuario.
const getLazyComponent = (key) => {
  const loader = menuComponentsMap[key];
  if (!loader) {
    console.warn(`Componente no registrado: ${key}, usando default`);
  }

  return lazy(() =>
    (loader || menuComponentsMap.default)()
      .catch((err) => {
        console.error(`Error cargando ${key}:`, err);
        return menuComponentsMap.default();
      })
  );
};

const arrayRutas = menu.map((ruta) => {

  const ElementMenu = getLazyComponent(ruta.componentPath);

  const contieneID = ruta.PATHNAME.search(":id");

  if (contieneID !== -1) {
    return (
      <Route
        key={ruta.PATHNAME}
        path={ruta.PATHNAME}
        element={<PrivateRoute children={<ElementMenu />} />}
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
       element={<PrivateRoute children={<ElementMenu />} />}
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
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="*" element={<Default />}></Route>
    </Route>
  )
);

export default router;
