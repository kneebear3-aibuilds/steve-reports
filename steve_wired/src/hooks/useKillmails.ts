import { useState, useCallback } from "react";

const STILLNESS_RPC = "https://fullnode.mainnet.sui.io:443";
const KILLMAIL_REGISTRY = import.meta.env.VITE_KILLMAIL_REGISTRY ||
  "0x7fd9a32d0bbe7b1cfbb7140b1dd4312f54897de946c399edb21c3a12e52ce283";

export interface KillmailEvent {
  attacker: string;
  victim: string;
  system: string;
  timestamp: string;
  shipType?: string;
  raw: unknown;
}

export interface FeedItem {
  meta: string;
  text: string;
  type: "danger" | "info" | "neutral";
}

function parseTimestamp(ts: string | number): string {
  try {
    const ms = typeof ts === "string" ? parseInt(ts) : ts;
    // Sui timestamps are in milliseconds
    const date = new Date(ms > 1e12 ? ms : ms * 1000);
    return date.toISOString().slice(11, 19) + " FST";
  } catch {
    return "??:??:?? FST";
  }
}

function extractKillmailFields(event: Record<string, unknown>): KillmailEvent | null {
  try {
    // Sui event parsedJson contains the actual fields
    const parsed = (event.parsedJson as Record<string, unknown>) || {};
    const fields = parsed as Record<string, unknown>;

    // Try multiple field name patterns (blockchain schemas vary)
    const attacker =
      (fields.attacker as string) ||
      (fields.killer as string) ||
      (fields.winner as string) ||
      "UNKNOWN";

    const victim =
      (fields.victim as string) ||
      (fields.killed as string) ||
      (fields.loser as string) ||
      "UNKNOWN";

    const system =
      (fields.system as string) ||
      (fields.location as string) ||
      (fields.solar_system as string) ||
      "UNKNOWN SYSTEM";

    const tsRaw =
      (fields.timestamp as string) ||
      (fields.time as string) ||
      (event.timestampMs as string) ||
      Date.now().toString();

    return {
      attacker,
      victim,
      system,
      timestamp: parseTimestamp(tsRaw),
      shipType: (fields.ship_type as string) || (fields.shipType as string),
      raw: event,
    };
  } catch {
    return null;
  }
}

function killmailToFeedItem(km: KillmailEvent, index: number): FeedItem {
  const shipNote = km.shipType ? ` in a ${km.shipType}` : "";
  const text = `${km.attacker} destroyed ${km.victim}${shipNote} in ${km.system}.`;
  return {
    meta: km.timestamp,
    text,
    type: index < 3 ? "danger" : "neutral",
  };
}

export function useKillmails() {
  const [killmails, setKillmails] = useState<KillmailEvent[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKillmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STILLNESS_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_queryEvents",
          params: [
            {
              MoveEventModule: {
                package: import.meta.env.VITE_WORLD_PACKAGE ||
                  "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c",
                module: "kill_mail",
              },
            },
            null,
            50,
            false,
          ],
        }),
      });

      if (!response.ok) throw new Error(`RPC error: ${response.status}`);

      const data = await response.json();
      const events: Record<string, unknown>[] = data?.result?.data || [];

      if (events.length === 0) {
        // Fallback: try object-based query on the registry
        const regResponse = await fetch(STILLNESS_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "suix_queryEvents",
            params: [
              { Package: import.meta.env.VITE_WORLD_PACKAGE ||
                "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c" },
              null,
              50,
              false,
            ],
          }),
        });
        const regData = await regResponse.json();
        const regEvents: Record<string, unknown>[] = regData?.result?.data || [];
        events.push(...regEvents);
      }

      const parsed = events
        .map((e) => extractKillmailFields(e))
        .filter((km): km is KillmailEvent => km !== null);

      setKillmails(parsed);
      setFeedItems(parsed.map(killmailToFeedItem));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      // Don't leave the UI dead — set empty arrays so Steve can report on the silence
      setKillmails([]);
      setFeedItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { killmails, feedItems, loading, error, fetchKillmails };
}
