import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import useSidebar from "@/hooks/useSidebar";
import Sidebar from "./SideBar";
import { nameSystem } from "@/settings.json";

const Layout = ({menuUser}) => {
  const useSidebarHook = useSidebar();

  const handleSideBar = () =>
    useSidebarHook.sidebarOpen
      ? useSidebarHook.hideSidebar()
      : useSidebarHook.showSidebar();
  // const listMenu = [
  //   { title: "Inicio", icon: "home", url: "/dashboard" }, //Pacientes Turnos Configuración
  //   { title: "Pacientes", icon: "users", url: "/pacientes" },
  //   { title: "Turnos", icon: "calendar-days", url: "/" },
  //   { title: "Configuración", icon: "gears", url: "/" },
  // ];
  const ITEM_VISIBILITY = 1;
  const ItemsMenu = [];
  menuUser.forEach((item) => {
    if (item.VISIBLE === ITEM_VISIBILITY) {
      ItemsMenu.push({
        url: item.PATHNAME,
        icon: item.ICONO,
        title: item.DESCRIPCION,
      });
    }
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        menu={ItemsMenu}
        title={nameSystem}
        hook={useSidebarHook}
        handle={handleSideBar}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-md:px-10 min-md:pt-10 gap-10">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4   bg-white shadow min-md:rounded-lg">
          <button className="md:hidden text-gray-700" onClick={handleSideBar}>
            ☰
          </button>
          <h2 className="text-xl font-semibold">Panel Principal</h2>
        </header>

        {/* Content */}
        <main className="flex overflow-y-auto p-4 bg-white shadow min-md:rounded-lg">
          <Suspense>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
