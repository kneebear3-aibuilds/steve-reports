import { useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import SystemInput from "@/components/SystemInput";
import IntelPanel from "@/components/IntelPanel";
import IntelFeed from "@/components/IntelFeed";
import BriefPanel from "@/components/BriefPanel";
import BottomBar from "@/components/BottomBar";
import ConnectPrompt from "@/components/ConnectPrompt";
import { useKillmails } from "@/hooks/useKillmails";
import { useSteve } from "@/hooks/useSteve";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [system, setSystem] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [showBrief, setShowBrief] = useState(false);

  const { killmails, feedItems, fetchKillmails } = useKillmails();
  const { steveData, loading: steveLoading, fetchSteve } = useSteve();

  const handleConnect = useCallback(() => setIsConnected(true), []);

  const handleScan = useCallback(async (sys: string) => {
    setSystem(sys);
    setIsScanning(true);
    setHasScanned(false);
    setShowBrief(false);

    // Fetch blockchain data first, then send to Steve
    await fetchKillmails();
    await new Promise((r) => setTimeout(r, 800));
    await fetchSteve(killmails, sys);

    setIsScanning(false);
    setHasScanned(true);
  }, [killmails, fetchKillmails, fetchSteve]);

  const handleRefresh = useCallback(() => {
    if (system) handleScan(system);
  }, [system, handleScan]);

  const stevePanel = (text: string | undefined, loading: boolean) => {
    if (loading || !text) {
      return (
        <div className="text-muted-foreground text-xs font-mono opacity-60 py-2">
          Steve is watching...
        </div>
      );
    }
    return (
      <div className="text-[12px] leading-[1.9] font-mono whitespace-pre-wrap">
        {text}
      </div>
    );
  };

  const DangerContent = stevePanel(steveData?.danger, steveLoading);
  const ActiveContent = stevePanel(steveData?.active, steveLoading);
  const OfflineContent = stevePanel(steveData?.offline, steveLoading);
  const BriefContent = stevePanel(steveData?.brief, steveLoading);

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground" style={{ backgroundColor: "var(--eve-bg)" }}>
      <TopBar />
      <SystemInput onScan={handleScan} isScanning={isScanning} />

      {!isConnected ? (
        <ConnectPrompt onConnect={handleConnect} />
      ) : (
        <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">
          {hasScanned && (
            <div className="flex items-center gap-3 text-[11px] tracking-[3px] text-muted-foreground uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-primary" />
              SYSTEM: <span className="text-primary">{system}</span>
              <span className="ml-auto font-mono opacity-50">
                KILLS ON RECORD: {killmails.length}
              </span>
            </div>
          )}

          <div className="flex gap-4 flex-1 min-h-0">
            <IntelPanel
              title="IS IT DANGEROUS HERE"
              content={DangerContent}
              isConnected={isConnected}
              isScanning={isScanning}
              hasSystem={hasScanned}
              threatLevel="danger"
            />
            <IntelPanel
              title="WHO IS ACTIVE NEARBY"
              content={ActiveContent}
              isConnected={isConnected}
              isScanning={isScanning}
              hasSystem={hasScanned}
              threatLevel="caution"
            />
            <IntelPanel
              title="WHILE YOU WERE OFFLINE"
              content={OfflineContent}
              isConnected={isConnected}
              isScanning={isScanning}
              hasSystem={hasScanned}
              threatLevel="clear"
              cardStyle="card-blue"
            />
          </div>

          {hasScanned && (
            <button
              onClick={() => setShowBrief(!showBrief)}
              className={`w-full btn-chunky transition-all ${
                showBrief ? "btn-chunky-primary" : "btn-chunky-outline"
              }`}
            >
              ◈ BRIEF ME — WHAT DO I NEED TO KNOW
            </button>
          )}

          <BriefPanel content={BriefContent} visible={showBrief} />
          <IntelFeed items={hasScanned ? feedItems : []} />
        </div>
      )}

      <BottomBar onRefresh={handleRefresh} onLoadMore={fetchKillmails} />
    </div>
  );
};

export default Index;
