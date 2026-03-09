import { useApp } from "../context/AppContext";
import Ticker from "../components/common/Ticker";
import TopBar from "../components/common/TopBar";
import StatCard from "../components/common/StatCard";

export default function DashboardScreen() {
    const { navigate, team } = useApp();
    const progress = ((team.round - 1) / team.totalRounds) * 100;

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <Ticker />
            <TopBar
                title="Dashboard"
                right={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="tag">{team.id}</span>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("login")}
                            style={{ width: "auto", padding: "6px 14px", fontSize: 11 }}
                        >
                            Logout
                        </button>
                    </div>
                }
            />

            <div
                style={{
                    padding: "20px 16px",
                    maxWidth: 480,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                {/* Round + Rank hero */}
                <div
                    className="fade-up card"
                    style={{
                        background: "linear-gradient(135deg, #1a1a26 0%, #12121a 100%)",
                        border: "1px solid var(--border)",
                        position: "relative",
                        overflow: "hidden",
                        padding: 24,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "rgba(232,197,71,0.05)",
                            border: "1px solid rgba(232,197,71,0.1)",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--muted)",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Current Round
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 800,
                                    fontSize: 48,
                                    color: "var(--accent)",
                                    lineHeight: 1.1,
                                }}
                            >
                                {team.round}
                            </div>
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>
                                of {team.totalRounds} locations
                            </div>
                        </div>
                        
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 20 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 11,
                                color: "var(--muted)",
                                marginBottom: 6,
                            }}
                        >
                            <span>Hunt Progress</span>
                            <span>
                                {team.round - 1}/{team.totalRounds} complete
                            </span>
                        </div>
                        <div
                            style={{
                                height: 4,
                                background: "var(--border)",
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${progress}%`,
                                    background: "var(--accent)",
                                    borderRadius: 2,
                                    transition: "width 0.6s ease",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div
                    className="fade-up-2"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
                >
                    <StatCard
                        label="Score"
                        value={`${team.score} pts`}
                        accent="var(--accent)"
                    />
                    <StatCard
                        label="Hints Used"
                        value={team.hintsUsed}
                        accent={team.hintsUsed > 2 ? "var(--danger)" : "var(--text)"}
                    />
                </div>

                {/* Current Clue */}
                <div
                    className="fade-up-3 card"
                    style={{ borderLeft: "3px solid var(--accent)" }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "var(--accent)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                        }}
                    >
                        Current Clue
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: "var(--text)",
                        }}
                    >
                        "{team.clue}"
                    </div>
                    <button
                        className="btn-danger"
                        onClick={() => navigate("hint")}
                        style={{
                            marginTop: 14,
                            width: "auto",
                            padding: "7px 16px",
                            fontSize: 11,
                        }}
                    >
                        💡 Request Hint (−5 pts)
                    </button>
                </div>

                {/* Action buttons */}
                <div
                    className="fade-up-4"
                    style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                    <button
                        className="btn-primary pulse-btn"
                        onClick={() => navigate("qr-verify")}
                    >
                        📷 Scan QR Code at Location
                    </button>
                    <button className="btn-secondary" onClick={() => navigate("puzzle")}>
                        🧩 Go to Current Puzzle
                    </button>
                </div>
            </div>
        </div>
    );
}