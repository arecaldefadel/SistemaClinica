import { useState } from "react";

const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showSidebar = () => setSidebarOpen(true);
  const hideSidebar = () => setSidebarOpen(false);

  return { sidebarOpen, showSidebar, hideSidebar };
};

export default useSidebar;
