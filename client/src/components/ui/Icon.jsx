import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @param {String} iconName Nombre de iconos fontawesome. Sin fa- o fas-
 * @param {String} className
 * @param {String} size "xl" | "1x" | "2xs" | "xs" | "sm" | "lg" | "2xl" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x"
 * @param {string} color Color en Hexadecimal
 * @returns
 */
const Icon = ({ iconName, className = "", size = "1x", color = "" }) => {
  return (
    <div className={`${className}`}>
      <FontAwesomeIcon icon={iconName} size={size} style={{ color }} />
    </div>
  );
};

export default Icon;
