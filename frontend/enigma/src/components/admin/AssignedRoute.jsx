export default function AssignedRoute({ route, currentRound }) {
  return (
    <div className="fade-up-2 card">
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
        Assigned Route
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {route.map((loc, i) => (
          <div
            key={loc}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              border: `1px solid ${i < 3 ? "var(--accent2)" : i === 3 ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 2,
              background: i < 3 ? "rgba(94,232,160,0.06)" : i === 3 ? "rgba(232,197,71,0.06)" : "transparent",
            }}
          >
            <span style={{ fontSize: 12 }}>{i < 3 ? "✅" : i === 3 ? "📍" : "⬜"}</span>
            <span style={{ fontSize: 12, color: i < currentRound ? "var(--text)" : "var(--muted)" }}>
              {loc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}