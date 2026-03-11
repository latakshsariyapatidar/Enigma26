export default function LeaderboardTable({ sorted, selected, setSelected, navigate }) {
    return (
        <div className="fade-up-2 card" style={{ padding: 0, overflow: "hidden" }}>
            <div
                style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>
                    Live Leaderboard
                </div>
                <span className="tag">Auto-updating</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <thead>
                        <tr style={{ background: "var(--surface2)" }}>
                            {["#", "Team", "Round", "Score", "Hints", ""].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: "10px 12px", textAlign: "left", color: "var(--muted)",
                                        fontWeight: 500, fontSize: 11, letterSpacing: "0.08em",
                                        textTransform: "uppercase", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((t, i) => (
                            <tr
                                key={t.id}
                                style={{
                                    borderBottom: "1px solid var(--border)",
                                    background: selected === t.id ? "rgba(232,197,71,0.04)" : "transparent",
                                    cursor: "pointer",
                                }}
                                onClick={() => setSelected(t.id)}
                            >
                                <td style={{ padding: "12px 12px", fontFamily: "var(--font-display)", fontWeight: 800, color: i === 0 ? "var(--accent)" : "var(--muted)" }}>
                                    {i + 1}
                                </td>
                                <td style={{ padding: "12px 12px", fontWeight: 500, color: "var(--text)" }}>{t.name}</td>
                                <td style={{ padding: "12px 12px" }}>{t.round}</td>
                                <td style={{ padding: "12px 12px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>{t.score}</td>
                                <td style={{ padding: "12px 12px", color: t.hints > 2 ? "var(--danger)" : "var(--muted)" }}>{t.hints}</td>
                                <td style={{ padding: "12px 12px" }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("admin-team-detail", t.teamId || t.id);
                                        }}
                                        style={{
                                            background: "none", border: "1px solid var(--border)", color: "var(--muted)",
                                            cursor: "pointer", padding: "3px 10px", fontSize: 11, borderRadius: 2, fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}