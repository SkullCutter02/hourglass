import { useEffect, MutableRefObject } from "react";

export function useOutsideClick(fn: (...any) => void, ...refs: MutableRefObject<any>[]) {
  useEffect(() => {
    function handleClickOutside(e) {
      const clickOutside = refs.every((ref) => !ref.current.contains(e.target));

      if (clickOutside) {
        fn();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs]);
}
