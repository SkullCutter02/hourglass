import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>();

  useEffect(() => {
    const checkSize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  });

  return windowWidth;
}
