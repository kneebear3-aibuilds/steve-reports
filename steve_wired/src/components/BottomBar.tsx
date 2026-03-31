const TICKER_TEXT =
  "CLONEBANK 86 WATCH: ACTIVE — BRETTIUS MAXIMUS: STILL AT LARGE — KURDOS: STILL IN PLETHORA — FUEL CHECK: HAVE YOU CHECKED YOUR FUEL — STEVE IS ASKING — STEVECOIN: NOT LEGAL TENDER — STEVE IS WATCHING";

interface BottomBarProps {
  onRefresh: () => void;
  onLoadMore: () => void;
}

const BottomBar = ({ onRefresh, onLoadMore }: BottomBarProps) => {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border-t-[3px] border-border">
      <button
        onClick={onRefresh}
        className="btn-chunky btn-chunky-outline text-[11px] py-2 px-4"
      >
        ◈ REFRESH
      </button>

      <div className="flex-1 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap text-muted-foreground text-xs font-mono">
          {TICKER_TEXT}
        </div>
      </div>

      <button
        onClick={onLoadMore}
        className="btn-chunky btn-chunky-outline text-[11px] py-2 px-4"
      >
        LOAD MORE ►
      </button>
    </div>
  );
};

export default BottomBar;
