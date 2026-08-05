import clipboardList from "lucide-static/icons/clipboard-list.svg?raw";
import dumbbell from "lucide-static/icons/dumbbell.svg?raw";
import history from "lucide-static/icons/history.svg?raw";
import layoutDashboard from "lucide-static/icons/layout-dashboard.svg?raw";
import trendingUp from "lucide-static/icons/trending-up.svg?raw";
import ruler from "lucide-static/icons/ruler.svg?raw";
import repeat from "lucide-static/icons/repeat.svg?raw";
import hardDrive from "lucide-static/icons/hard-drive.svg?raw";
import wifiOff from "lucide-static/icons/wifi-off.svg?raw";
import zap from "lucide-static/icons/zap.svg?raw";
import chevronDown from "lucide-static/icons/chevron-down.svg?raw";
import menu from "lucide-static/icons/menu.svg?raw";
import x from "lucide-static/icons/x.svg?raw";
import lock from "lucide-static/icons/lock.svg?raw";
import userX from "lucide-static/icons/user-x.svg?raw";
import target from "lucide-static/icons/target.svg?raw";
import crown from "lucide-static/icons/crown.svg?raw";
import brain from "lucide-static/icons/brain.svg?raw";
import gauge from "lucide-static/icons/gauge.svg?raw";
import barChart3 from "lucide-static/icons/bar-chart-3.svg?raw";
import refreshCw from "lucide-static/icons/refresh-cw.svg?raw";

/**
 * Registro central dos ícones utilizados no site (biblioteca Lucide,
 * importados como SVG puro — sem dependência de JavaScript em runtime).
 * Adicionar novos ícones aqui antes de usá-los no componente Icon.
 */
export const ICONS = {
  "clipboard-list": clipboardList,
  dumbbell,
  history,
  "layout-dashboard": layoutDashboard,
  "trending-up": trendingUp,
  ruler,
  repeat,
  "hard-drive": hardDrive,
  "wifi-off": wifiOff,
  zap,
  "chevron-down": chevronDown,
  menu,
  x,
  lock,
  "user-x": userX,
  target,
  crown,
  brain,
  gauge,
  "bar-chart-3": barChart3,
  "refresh-cw": refreshCw,
} as const;

export type IconName = keyof typeof ICONS;
