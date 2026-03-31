import { useState } from "react";

interface FeedItem {
  meta: string;
  text: string;
  type?: "danger" | "info" | "neutral";
}

interface IntelFeedProps {
  items: FeedItem[];
}

const IntelFeed = ({ items }: IntelFeedProps) => {
  const [highlighted, setHighlighted] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="card-chunky">
      <div className="px-4 py-3 text-[11px] tracking-[3px] uppercase font-bold text-muted-foreground border-b-[3px] border-border flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
        RECENT INTEL
        <span className="ml-auto font-mono text-primary">{items.length}</span>
      </div>
      <div className="max-h-[180px] overflow-y-auto">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => setHighlighted(i === highlighted ? null : i)}
            className={`feed-item-b2 px-4 py-3 flex items-start gap-3 ${
              highlighted === i ? "bg-primary/5" : ""
            }`}
          >
            <div className={`w-1 self-stretch flex-shrink-0 ${
              i < 3
                ? item.type === "danger" ? "bg-destructive" : "bg-primary"
                : "bg-transparent"
            }`} />
            <div>
              <span className="font-mono text-[10px] text-muted-foreground mr-2">{item.meta}</span>
              <span className={`text-xs ${
                item.type === "danger" ? "text-destructive font-bold" : "text-foreground"
              }`}>{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntelFeed;
