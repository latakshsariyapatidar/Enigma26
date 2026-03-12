export default function RoundLog({ rounds }) {
  return (
    <div className="fade-up-3 card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>
        Round Log
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
          <thead>
            <tr style={{ background: "var(--surface2)" }}>
              {["Rnd", "Location", "Type", "Attempts", "Hint", "Time", "Score"].map((h) => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 500, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, i) => (
              <tr key={r.r} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "var(--surface2)" }}>
                <td style={{ padding: "11px 12px", fontFamily: "var(--font-display)", fontWeight: 700 }}>{r.r}</td>
                <td style={{ padding: "11px 12px", color: "var(--text)", whiteSpace: "nowrap" }}>{r.loc}</td>
                <td style={{ padding: "11px 12px", color: "var(--muted)" }}>{r.type}</td>
                <td style={{ padding: "11px 12px", color: r.attempts > 2 ? "var(--danger)" : "var(--text)" }}>{r.attempts}</td>
                <td style={{ padding: "11px 12px", color: r.hint ? "var(--danger)" : "var(--accent2)", whiteSpace: "nowrap" }}>{r.hint ? "Yes −5" : "No"}</td>
                <td style={{ padding: "11px 12px", color: "var(--muted)", whiteSpace: "nowrap" }}>{r.time}</td>
                <td style={{ padding: "11px 12px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}