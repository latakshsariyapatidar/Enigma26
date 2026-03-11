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
              border: `1px solid grey`,
              borderRadius: 2,
              
            }}
          >
            <span style={{ fontSize: 12, color: i < currentRound ? "var(--text)" : "var(--muted)" }}>
              {loc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}