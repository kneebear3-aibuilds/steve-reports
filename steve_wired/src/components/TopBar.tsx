import { useState, useEffect } from "react";

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fst = time.toISOString().slice(11, 19) + " FST";

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-border">
      <div className="font-logo text-2xl tracking-[4px] flex items-center gap-2">
        <span className="text-primary">STEVE</span>
        <span className="text-secondary-foreground">REPORTS</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-dot inline-block" />
        <span className="text-primary text-xs font-bold tracking-[3px] uppercase">
          SIGNAL ACTIVE
        </span>
      </div>

      <div className="font-mono text-sm text-muted-foreground tracking-wider">
        {fst}
      </div>
    </div>
  );
};

export default TopBar;
