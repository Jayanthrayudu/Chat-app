import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading...", size = 20, className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-mist-300 ${className}`}>
      <Loader2 size={size} className="animate-spin text-signal-light" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
