import React, { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useSidebar from "@/hooks/useSidebar";
import Sidebar from "./SideBar";
import { nameSystem } from "@/settings.json";
import { nvl } from "@/utilities";
import { Dropdown, Modal, Input, Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ModaChangePassword from "../users/ModaChangePassword";

const Layout = ({ menuUser }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const useSidebarHook = useSidebar();
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleSideBar = () =>
    useSidebarHook.sidebarOpen
      ? useSidebarHook.hideSidebar()
      : useSidebarHook.showSidebar();

  const handleLogOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userData = {
    nick: localStorage.getItem("nombreUser"),
  };

  const generateIconUser = () => {
    const letter = document.getElementById("user-info-letter");
    const user = userData?.nick || false;
    if (user && letter) {
      letter.textContent = nvl(user[0], "").trim().toUpperCase(); // nombre_apellido[1][0].trim() + nombre_apellido[0][0].trim();
    }
  };

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

  useEffect(() => {
    // Set the icon user
    generateIconUser();
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {useSidebarHook.sidebarOpen ? (
        <div
          className="h-full w-full absolute z-29 bg-gray-600 opacity-50"
          onClick={() => useSidebarHook.hideSidebar()}></div>
      ) : null}
      <Sidebar
        menu={ItemsMenu}
        title={nameSystem}
        hook={useSidebarHook}
        handle={handleSideBar}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-lg:px-10 min-lg:pt-10 gap-10">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 bg-white shadow min-md:rounded-lg">
          <button className="lg:hidden text-gray-700" onClick={handleSideBar}>
            ☰
          </button>
          <div className="flex items-center justify-end gap-4 w-full">
            <Dropdown
              trigger={
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{userData.nick}</span>
                  <span
                    id="user-info-letter"
                    className="flex items-center justify-center font-bold text-[var(--accent)] w-10 h-10 rounded-full bg-[var(--primary)] cursor-pointer"></span>
                </div>
              }>
              <button
                className="w-full text-left px-4 py-2 hover:bg-[var(--gray)]"
                onClick={() => setShowProfile(true)}>
                Modificar perfil
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-[var(--gray)]"
                onClick={() => setShowChangePassword(true)}>
                Cambiar contraseña
              </button>
              <button
                onClick={handleLogOut}
                className="w-full text-left px-4 py-2 hover:bg-[var(--gray)] text-[var(--button-danger)]">
                Cerrar sesión
              </button>
            </Dropdown>
          </div>
        </header>

        {/* Content */}
        <main className="flex overflow-y-auto p-4 bg-white shadow min-md:rounded-lg">
          <Suspense>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Modal para cambiar contraseña */}
      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Modificar Contraseña">
        <ModaChangePassword
          refresh={() => setShowChangePassword(false)}
          setShowModal={setShowChangePassword}
        />
      </Modal>
      {/* Modal de Modificación de Perfil */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Modificar Perfil">
        <div className="flex flex-col gap-4">
          <form className="flex flex-col gap-4">
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Nombre"}
                name={"nombre"}
                value={""}
                className="max-sm:w-full"
              />
              <Input
                label={"Apellido"}
                name={"apellido"}
                value={""}
                className="max-sm:w-full"
              />
            </div>
            <div className="flex gap-4 md:flex-row  flex-col max-sm:w-full">
              <Input
                label={"Usuario"}
                name={"username"}
                value={""}
                className="max-sm:w-full"
              />
            </div>
            <div className="flex flex-row">
              <div className="flex gap-4">
                <Button
                  title="Cancelar"
                  variant="danger"
                  onClick={() => setShowProfile(false)}
                />
                <Button title="Guardar" onClick={() => setShowProfile(false)} />
              </div>
            </div>
          </form>
        </div>
      </Modal>
      {/* Fin del modal */}
    </div>
  );
};

export default Layout;
