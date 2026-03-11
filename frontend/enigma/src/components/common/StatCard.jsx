const StatCard = ({ label, value, accent }) => (
  <div className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
    <div
      style={{
        fontSize: 11,
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 22,
        color: accent || "var(--text)",
      }}
    >
      {value}
    </div>
  </div>
);

export default StatCard;