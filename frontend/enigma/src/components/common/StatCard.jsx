const StatCard = ({ label, value, accent }) => (
  <div className="card" style={{ textAlign: "center", padding: window.innerWidth <= 480 ? "12px 8px" : "14px 10px" }}>
    <div
      style={{
        fontSize: window.innerWidth <= 480 ? 10 : 11,
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
        fontSize: window.innerWidth <= 480 ? 18 : 22,
        color: accent || "var(--text)",
      }}
    >
      {value}
    </div>
  </div>
);

export default StatCard;