import { ReactNode } from "react";

interface BriefPanelProps {
  content: ReactNode;
  visible: boolean;
}

const BriefPanel = ({ content, visible }: BriefPanelProps) => {
  if (!visible) return null;

  return (
    <div className="card-blue animate-fade-up">
      <div className="header-bar-b2 border-blue-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-300 animate-blink" />
          STEVE&apos;S BRIEFING
        </div>
      </div>
      <div className="p-4 text-[12px] leading-[1.9] font-mono">
        {content}
      </div>
    </div>
  );
};

export default BriefPanel;
