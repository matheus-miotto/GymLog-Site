import clipboardList from "lucide-static/icons/clipboard-list.svg?raw";
import trendingUp from "lucide-static/icons/trending-up.svg?raw";
import repeat from "lucide-static/icons/repeat.svg?raw";
import wifiOff from "lucide-static/icons/wifi-off.svg?raw";
import userX from "lucide-static/icons/user-x.svg?raw";
import lock from "lucide-static/icons/lock.svg?raw";
import chevronDown from "lucide-static/icons/chevron-down.svg?raw";
import menu from "lucide-static/icons/menu.svg?raw";
import x from "lucide-static/icons/x.svg?raw";
import sun from "lucide-static/icons/sun.svg?raw";
import moon from "lucide-static/icons/moon.svg?raw";
import monitor from "lucide-static/icons/monitor.svg?raw";

/**
 * Registro central dos ícones utilizados no site (biblioteca Lucide,
 * importados como SVG puro — sem dependência de JavaScript em runtime).
 * Adicionar novos ícones aqui antes de usá-los no componente Icon.
 */
export const ICONS = {
  "clipboard-list": clipboardList,
  "trending-up": trendingUp,
  repeat,
  "wifi-off": wifiOff,
  "user-x": userX,
  lock,
  "chevron-down": chevronDown,
  menu,
  x,
  sun,
  moon,
  monitor,
} as const;

export type IconName = keyof typeof ICONS;
