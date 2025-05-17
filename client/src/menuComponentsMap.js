export const menuComponentsMap = {
  // Componentes de menú
  "menu-dashboard": () => import("@/pages/Dashboard"),
  "menu-playground": () => import("@/pages/Playground"),
  "menu-pacientes": () => import("@/pages/Dashboard/views/Pacientes"),
  "menu-turnos": () => import("@/pages/Dashboard/views/Turnos"),

  // Fallback si el componente no está registrado
  default: () => import("@/pages/Default"),
};
