import React from "react";

const TitleContent = ({ title = "", subtitle = "" }) => {
  return (
    <>
      <span className="text-3xl font-bold text-[var(--text)]">
        {title}
      </span>
      <span className="text-[var(--muted)]">
        {subtitle}
      </span>
    </>
  );
};

export default TitleContent;
