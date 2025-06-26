import { useEffect, useState } from "react";

export function useBlockedByClientDetector() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (
        typeof event?.message === "string" &&
        event.message.includes("ERR_BLOCKED_BY_CLIENT")
      ) {
        setIsBlocked(true);
      }
    };

    window.addEventListener("error", handler);

    return () => {
      window.removeEventListener("error", handler);
    };
  }, []);

  return isBlocked;
}
