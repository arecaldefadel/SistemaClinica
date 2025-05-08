import React, { useState } from "react";
import { PathContext } from "./PathContext";

export const PathProvider = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname);
  const [oldPath, setOldPath] = useState(window.location.pathname);
  const [formUri, setFormUri] = useState("");

  return (
    <PathContext.Provider value={{ path, setPath, oldPath, setOldPath, formUri, setFormUri }}>
      {children}
    </PathContext.Provider>
  );
};
