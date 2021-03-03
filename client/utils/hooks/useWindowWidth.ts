import { useState, useEffect } from "react";

let defaultWidth: number;

if (typeof window !== "undefined") {
  defaultWidth = window.innerWidth;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(defaultWidth);

  useEffect(() => {
    const checkSize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  });

  return windowWidth;
}
