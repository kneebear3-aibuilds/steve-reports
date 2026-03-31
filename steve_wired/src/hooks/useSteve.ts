import { useState, useCallback } from "react";
import type { KillmailEvent } from "./useKillmails";

export interface SteveData {
  danger: string;
  active: string;
  offline: string;
  brief: string;
}

const STEVE_LOADING: SteveData = {
  danger: "Steve is reading the situation.",
  active: "Steve is checking who has been moving.",
  offline: "Steve is reviewing what happened while you were away.",
  brief: "Steve is assembling the full picture.",
};

export function useSteve() {
  const [steveData, setSteveData] = useState<SteveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteve = useCallback(async (killmails: KillmailEvent[], system: string) => {
    setLoading(true);
    setError(null);
    setSteveData(STEVE_LOADING);

    try {
      const response = await fetch("/api/steve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ killmails, system }),
      });

      if (!response.ok) {
        throw new Error(`Steve API error: ${response.status}`);
      }

      const text = await response.text();
      const data: SteveData = JSON.parse(text);

      // Validate we got all four fields
      if (!data.danger || !data.active || !data.offline || !data.brief) {
        throw new Error("Steve returned an incomplete report.");
      }

      setSteveData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      // Give Steve something to say even on failure
      setSteveData({
        danger: "Steve cannot reach the network. This is either a technical failure or an ambush. Steve considers both equally likely.",
        active: "Steve has no pilot data. Steve notes this is not the same as there being no pilots.",
        offline: "Steve lost the feed. What happened while you were gone is currently classified as unknown. Steve dislikes unknown.",
        brief: "The situation is unclear. Steve finds unclear situations more dangerous than clear ones. Check your fuel. Steve is serious about the fuel.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { steveData, loading, error, fetchSteve };
}
