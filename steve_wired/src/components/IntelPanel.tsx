import { ReactNode } from "react";

interface IntelPanelProps {
  title: string;
  content: ReactNode;
  isConnected: boolean;
  isScanning: boolean;
  hasSystem: boolean;
  threatLevel?: "danger" | "caution" | "clear";
  cardStyle?: string;
}

const IntelPanel = ({ title, content, isConnected, isScanning, hasSystem, threatLevel, cardStyle }: IntelPanelProps) => {
  const cardClass = cardStyle || (
    threatLevel === "danger" ? "card-danger" :
    threatLevel === "caution" ? "card-orange" : "card-blue"
  );

  const renderContent = () => {
    if (!isConnected) {
      return <span className="text-muted-foreground text-center block py-10 text-sm">CONNECT TO SCAN</span>;
    }
    if (!hasSystem) {
      return <span className="text-muted-foreground text-center block py-10 text-sm opacity-50">ENTER SYSTEM TO SCAN</span>;
    }
    if (isScanning) {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <span className="animate-blink text-sm tracking-[4px] font-bold opacity-80">SCANNING...</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1.5 h-5 bg-current opacity-40"
                style={{ animation: `blink 1.2s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-up text-[12px] leading-[1.9] font-mono">
        {content}
      </div>
    );
  };

  const headerBorderColor =
    threatLevel === "danger" ? "border-red-800" :
    threatLevel === "caution" ? "border-orange-700" : "border-blue-800";

  return (
    <div className="flex-1 flex flex-col min-w-0 card-chunky transition-all duration-500">
      <div className={`header-bar-b2 ${headerBorderColor} border-inherit`}>
        <div className="flex items-center gap-2">
          {hasSystem && !isScanning && threatLevel && (
            <span className={`w-2 h-2 rounded-full ${
              threatLevel === "danger" ? "bg-red-400 animate-blink" :
              threatLevel === "caution" ? "bg-orange-300" : "bg-blue-300"
            }`} />
          )}
          {title}
        </div>
      </div>
      <div className="p-4 flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default IntelPanel;
