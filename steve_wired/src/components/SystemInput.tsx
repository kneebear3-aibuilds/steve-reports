import { useState } from "react";

interface SystemInputProps {
  onScan: (system: string) => void;
  isScanning: boolean;
}

const SystemInput = ({ onScan, isScanning }: SystemInputProps) => {
  const [system, setSystem] = useState("");

  const handleScan = () => {
    if (system.trim()) onScan(system.trim());
  };

  return (
    <div className="px-6 py-5 border-b-[3px] border-border">
      <div className="flex items-center gap-4">
        <span className="text-[11px] tracking-[3px] uppercase text-muted-foreground font-bold whitespace-nowrap">
          CURRENT SYSTEM
        </span>
        <input
          type="text"
          value={system}
          onChange={(e) => setSystem(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="ENTER SYSTEM NAME..."
          className="flex-1 bg-muted border-[3px] border-border px-4 py-3 text-sm text-primary font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 tracking-wider transition-all"
        />
        <button
          onClick={handleScan}
          disabled={isScanning || !system.trim()}
          className="btn-chunky btn-chunky-primary disabled:opacity-30 disabled:transform-none disabled:shadow-none"
        >
          SCAN ◈
        </button>
      </div>
    </div>
  );
};

export default SystemInput;
