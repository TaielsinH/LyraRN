import { useState } from "react";

export function useHamburgerMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  function openMenu() {
    setMenuVisible(true);
  }

  function closeMenu() {
    setMenuVisible(false);
  }

  return { menuVisible, openMenu, closeMenu };
}
