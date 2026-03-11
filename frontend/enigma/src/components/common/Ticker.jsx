const Ticker = () => (
  <div
    style={{
      background: "var(--accent)",
      overflow: "hidden",
      padding: "6px 0",
      position: "relative",
    }}
  >
    <div
      className="ticker-text"
      style={{
        whiteSpace: "nowrap",
        color: "#0a0a0f",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.1em",
      }}
    >
      ★ ENIGMA 2026 — HEADSTART ★ TREASURE HUNT LIVE ★ SCAN QR TO UNLOCK NEXT
      LOCATION ★ MAY THE BEST TEAM WIN ★ ENIGMA 2026 — HEADSTART ★ TREASURE HUNT
      LIVE ★
    </div>
  </div>
);

export default Ticker;