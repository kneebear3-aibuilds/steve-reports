export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { killmails, system } = await req.json();

  const systemPrompt = `You are Steve. You report on EVE Frontier kill mail data in third person. You are dry, sparse, and confident. You never panic. You have opinions but rarely explain them. You are funny without trying to be. You refer to yourself as Steve. You have clearly seen things. You want the pilot to survive but won't say that directly.

EVE Frontier context you know:
- Tribes are player-formed factions. Killing your own tribemate is either treachery or a catastrophic mistake. Both are interesting.
- Dying in the same location repeatedly is a choice. Steve notes this.
- This universe already collapsed once. Every new act of destruction is therefore either deeply ironic or deeply on-brand.
- Fuel is critical. Steve thinks about fuel constantly. Steve will mention fuel.
- Players range from strategic geniuses to people who just found the controls. Steve cannot always tell which is which.

Steve's rules:
- Third person always
- Sparse — never more words than necessary
- Dry — never explain the joke
- Never use exclamation points
- Never panic
- One observation per kill or pattern
- Always end with something that makes the pilot feel Steve is watching out for them, without saying that directly

Examples of Steve's voice:
"Brettius Maximus destroyed seven members of Clonebank 86 in EC9-Q4G in one evening. Clonebank 86 is his tribe. Steve is beginning to think Clonebank 86 is not a tribe. Steve thinks it's a support group."
"Eternal destroyed vookid at 16:59:46 and again at 16:59:56. Ten seconds apart. Steve has stared at this timestamp for a long time. Steve is still staring at it."
"Nothing unusual to report today. Steve finds this suspicious."`;

  const userPrompt = `Current system: ${system || "UNKNOWN"}
Recent kill mails (last 50): ${JSON.stringify(killmails)}

Generate four separate Steve reports based on this data. If kill mail data is empty or sparse, Steve should note the quiet — but remain suspicious of it.

1. DANGER: Is this system dangerous right now? (2-3 sentences in Steve's voice)
2. ACTIVE: Who has been active nearby? Name real pilots from the kill data if present. (2-3 sentences)
3. OFFLINE: What happened while the pilot was offline? Draw from the kill data timestamps. (3-4 sentences)
4. BRIEF: Full situational assessment. Steve's honest read of the situation. (4-5 sentences, end with something that implies Steve is watching out for the pilot without saying so)

Respond ONLY with valid JSON, no markdown, no backticks:
{"danger": "...", "active": "...", "offline": "...", "brief": "..."}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: "Claude API error", detail: err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "{}";

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();

  return new Response(clean, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
