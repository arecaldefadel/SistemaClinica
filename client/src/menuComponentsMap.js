export const menuComponentsMap = {
  // Componentes de menú
  "menu-dashboard": () => import("@/pages/Dashboard"),
  // "menu-playground": () => import("@/pages/Playground"),
  "menu-pacientes": () => import("@/pages/Dashboard/views/Pacientes"),
  "menu-turnos": () => import("@/pages/Dashboard/views/Turnos"),
  "menu-pagos": () => import("@/pages/Dashboard/views/Pagos"),
  "menu-configuracion": () => import("@/pages/Dashboard/views/Configuracion"),
  // Fallback si el componente no está registrado
  default: () => import("@/pages/Default"),
};
