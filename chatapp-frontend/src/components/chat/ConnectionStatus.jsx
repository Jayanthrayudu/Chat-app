import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { CONNECTION_STATUS } from "../../utils/constants";

const CONFIG = {
  [CONNECTION_STATUS.CONNECTED]: {
    label: "Connected",
    icon: Wifi,
    className: "text-emerald-400 bg-emerald-950/40 border-emerald-900/50",
  },
  [CONNECTION_STATUS.CONNECTING]: {
    label: "Connecting",
    icon: Loader2,
    className: "text-amber-300 bg-amber-950/30 border-amber-900/40",
    spin: true,
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    label: "Reconnecting",
    icon: Loader2,
    className: "text-amber-300 bg-amber-950/30 border-amber-900/40",
    spin: true,
  },
  [CONNECTION_STATUS.DISCONNECTED]: {
    label: "Disconnected",
    icon: WifiOff,
    className: "text-red-300 bg-red-950/30 border-red-900/40",
  },
};

export default function ConnectionStatus({ status, className = "" }) {
  const config = CONFIG[status] || CONFIG[CONNECTION_STATUS.DISCONNECTED];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      <Icon size={12} className={config.spin ? "animate-spin" : ""} />
      <span>{config.label}</span>
    </div>
  );
}
