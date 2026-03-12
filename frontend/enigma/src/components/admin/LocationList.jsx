import TopBar from "../common/TopBar";
import StatCard from "../common/StatCard";

export default function LocationList({ locations, openAdd, openEdit, deleteConfirm, setDeleteConfirm, deleteLocation }) {
    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar
                title="Location Manager"
                back="admin-dashboard"
                right={
                    <button className="btn-primary" onClick={openAdd} style={{ width: "auto", padding: "7px 16px", fontSize: 12 }}>
                        + Add Location
                    </button>
                }
            />
            <div style={{ padding: "16px", maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="fade-up responsive-grid">
                    <StatCard label="Total" value={locations.length} />
                    <StatCard label="With Image" value={locations.filter((l) => l.hasImage).length} />
                    <StatCard label="Clue-only" value={locations.filter((l) => l.clueOnly).length} />
                    <StatCard label="Max Route" value="10–15" />
                </div>

                <div className="fade-up-2" style={{ fontSize: 12, color: "var(--muted)", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 2, background: "var(--surface)", lineHeight: 1.6 }}>
                    💡 Add <strong style={{ color: "var(--text)" }}>10–15 locations</strong> to the pool. Each team will be assigned a random route of 7–8 from this list.
                </div>

                {locations.map((loc, i) => (
                    <div
                        key={loc.id}
                        className={i === 0 ? "fade-up-2" : i === 1 ? "fade-up-3" : "fade-up-4"}
                        style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}
                    >
                        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", flex: "1 1 auto", minWidth: 0 }}>
                                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>#{String(i + 1).padStart(2, "0")}</span>
                                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc.name}</span>
                                <span className="tag" style={{ fontSize: 10, flexShrink: 0 }}>{loc.qrId}</span>
                                {loc.clueOnly && <span className="tag" style={{ color: "var(--accent2)", borderColor: "var(--accent2)", fontSize: 10, flexShrink: 0 }}>clue-only</span>}
                                {loc.hasImage && <span className="tag" style={{ fontSize: 10, flexShrink: 0 }}>🖼️ image</span>}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>

                                <button
                                    onClick={() => setDeleteConfirm(loc.id)}
                                    style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", padding: "4px 12px", fontSize: 11, borderRadius: 2, fontFamily: "var(--font-mono)", transition: "all 0.15s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: window.innerWidth <= 480 ? "1fr" : "1fr 1fr", gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Clue</div>
                                <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5, opacity: 0.85, wordBreak: "break-word" }}>"{loc.clue.length > 60 ? loc.clue.slice(0, 60) + "…" : loc.clue}"</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Puzzle <span style={{ color: "var(--accent2)" }}>({loc.puzzleType})</span></div>
                                <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5, opacity: 0.85, wordBreak: "break-word" }}>"{loc.puzzle.length > 60 ? loc.puzzle.slice(0, 60) + "…" : loc.puzzle}"</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Answer</div>
                                <div style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, wordBreak: "break-word" }}>{loc.answer}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Hints set</div>
                                <div style={{ fontSize: 12, color: loc.clueHint && loc.puzzleHint ? "var(--accent2)" : "var(--danger)" }}>
                                    {loc.clueHint ? "✅" : "❌"} Clue hint &nbsp; {loc.puzzleHint ? "✅" : "❌"} Puzzle hint
                                </div>
                            </div>
                        </div>

                        {deleteConfirm === loc.id && (
                            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--danger)", background: "rgba(232,94,94,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                                <span style={{ fontSize: 12, color: "var(--danger)" }}>Delete "{loc.name}"? This cannot be undone.</span>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => deleteLocation(loc.id)} style={{ background: "var(--danger)", border: "none", color: "white", cursor: "pointer", padding: "5px 14px", fontSize: 11, borderRadius: 2, fontFamily: "var(--font-mono)" }}>Delete</button>
                                    <button onClick={() => setDeleteConfirm(null)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", padding: "5px 14px", fontSize: 11, borderRadius: 2, fontFamily: "var(--font-mono)" }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {locations.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 14 }}>
                        No locations yet. Click <strong style={{ color: "var(--accent)" }}>+ Add Location</strong> to begin.
                    </div>
                )}
            </div>
        </div>
    );
}