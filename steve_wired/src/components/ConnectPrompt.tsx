const ConnectPrompt = ({ onConnect }: { onConnect: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl tracking-tight text-foreground">
          Intelligence Awaiting
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Connect your EVE Vault to access real-time system intelligence, threat analysis, and Steve's personal observations.
        </p>
      </div>
      <button
        onClick={onConnect}
        className="btn-chunky btn-chunky-primary text-base"
      >
        CONNECT EVE VAULT ◈
      </button>
      <div className="flex gap-6 mt-4">
        {["THREAT ANALYSIS", "PILOT TRACKING", "OFFLINE REPORTS"].map((label) => (
          <div key={label} className="card-chunky px-4 py-3 text-center">
            <div className="text-[10px] tracking-[2px] text-muted-foreground font-bold">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectPrompt;
