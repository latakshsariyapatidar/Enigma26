import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";

export default function NextClueScreen() {
    const { navigate, team, setTeam } = useApp();
    const isFinal = team.round >= team.totalRounds;

    useEffect(() => {
        if (!isFinal) setTeam((t) => ({ ...t, round: t.round + 1 }));
    }, []);

    if (isFinal)
        return (
            <div
                className="screen dot-grid"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="noise" />
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        textAlign: "center",
                        padding: "0 24px",
                        maxWidth: 400,
                    }}
                >
                    <div className="fade-up" style={{ fontSize: 64, marginBottom: 16 }}>
                        🏆
                    </div>
                    <div
                        className="fade-up-2"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: 36,
                            color: "var(--accent)",
                            marginBottom: 12,
                        }}
                    >
                        Hunt Complete!
                    </div>
                    <div
                        className="fade-up-3"
                        style={{
                            color: "var(--muted)",
                            fontSize: 15,
                            lineHeight: 1.7,
                            marginBottom: 24,
                        }}
                    >
                        Congratulations! You have completed the Enigma treasure hunt. Your
                        final score has been recorded.
                    </div>
                    <div className="fade-up-4 card" style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: 32,
                                color: "var(--accent)",
                            }}
                        >
                            {team.score} pts
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
                            Final Score — Rank #{team.rank}
                        </div>
                    </div>
                    <button
                        className="btn-primary fade-up-4"
                        onClick={() => navigate("dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar title="Round Complete!" />
            <div
                style={{
                    padding: "32px 20px",
                    maxWidth: 440,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                <div className="fade-up" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: 24,
                            color: "var(--accent2)",
                        }}
                    >
                        Puzzle Solved!
                    </div>
                </div>

                {/* Score update */}
                <div
                    className="fade-up-2 card"
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        textAlign: "center",
                        padding: 20,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            Points Earned
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: 28,
                                color: "var(--accent2)",
                                marginTop: 4,
                            }}
                        >
                            +20
                        </div>
                    </div>
                    <div style={{ width: 1, background: "var(--border)" }} />
                    <div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            New Score
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: 28,
                                color: "var(--accent)",
                                marginTop: 4,
                            }}
                        >
                            {team.score}
                        </div>
                    </div>
                    <div style={{ width: 1, background: "var(--border)" }} />
                    <div>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            Next Round
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: 28,
                                color: "var(--text)",
                                marginTop: 4,
                            }}
                        >
                            {team.round}
                        </div>
                    </div>
                </div>

                {/* Next clue */}
                <div
                    className="fade-up-3 card"
                    style={{ borderTop: "2px solid var(--accent)" }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "var(--accent)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                        }}
                    >
                        Your Next Clue
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            lineHeight: 1.7,
                        }}
                    >
                        {team.clue || "No clue available yet."}
                    </div>
                </div>

                <button
                    className="btn-primary fade-up-4"
                    onClick={() => navigate("dashboard")}
                >
                    Continue Hunt →
                </button>
            </div>
        </div>
    );
}