// import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { PathContext } from "@/context/PathContext";
import settings from "@/settings.json";

const Sidebar = ({ menu = [], title = "", hook = {}, handle = () => {} }) => {
  // const navigate = useNavigate();
  const { path, oldPath, setOldPath, setPath } = useContext(PathContext);


  useEffect( ()=>{
    setPath(window.location.hash.split("#")[1])
  })

    useEffect(() => {
    // Buscamos el ítem del menú que matchee con el path actual
    const matchedItem = menu.find((item) => {
      const urlItem = item.url === "/" ? "/" : `/${item.url}`;
      return path === urlItem;
    });

    if (matchedItem) {
      const newPath =
        matchedItem.url === "/" ? "/" : `/${matchedItem.url}`;

      // Solo actualizamos si es diferente al oldPath para evitar renders innecesarios
      if (oldPath !== newPath) {
        setOldPath(newPath);
      }
    }
  }, [menu, path, oldPath, setOldPath]);



  const handledSelect = (selectedItem, url ) => {
    setPath(url)
    const activateItem = selectedItem.classList.contains("active-item");
    let oldItem = document.querySelector(".active-item");
    if (!activateItem) {
      if (oldItem) oldItem.classList.remove("active-item");
      selectedItem.closest(".nav-item").classList.add("active-item");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
      ${
        hook.sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="h-full flex flex-col gap-2 space-y-4 bg-[var(--primary)] rounded-r-lg">
          <div className="flex flex-row items-center w-full md:p-4">
            <div className="md:hidden flex items-center justify-betweenshadow p-4">
              <button className=" text-white" onClick={handle}>
                ☰
              </button>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center h-20 w-20 bg-white rounded-full max-md:hidden">
                <img
                  src={settings.logoSystem}
                  alt=""
                  className="rounded-full w-18 h-18 object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-[var(--text)] ">{title}</h1>
            </div>
          </div>
          <nav className="flex flex-col">
            {menu.map((item, i) => {
          const urlItem = item.url === "/" ? "/" : `/${item.url}`;
          const classActive =
            !path || path === urlItem || oldPath === urlItem
              ? "active-item"
              : "";

              return (
                <Link to={item.url} onClick={(e) => handledSelect(e.target, item.url, item.title)} key={i}>
                  <div className={`nav-item flex flex-row items-center px-5 h-10 gap-4 text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--secondary)] hover:rounded-md ${classActive}`}>
                    <Icon iconName={item.icon} />
                    <span key={i} href={item.url || '/'} className="font-bold">
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
