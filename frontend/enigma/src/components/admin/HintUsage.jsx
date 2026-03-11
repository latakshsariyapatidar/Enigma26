export default function HintUsage({ teams }) {
  return (
    <div className="fade-up-3 card">
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
        Hint Usage Overview
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {teams.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid var(--border)", borderRadius: 2, padding: "8px 14px",
              textAlign: "center", background: "var(--surface2)",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.name}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: t.hints > 2 ? "var(--danger)" : "var(--text)", marginTop: 2 }}>
              {t.hints}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>hints</div>
          </div>
        ))}
      </div>
    </div>
  );
}