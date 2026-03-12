import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";
import api from "../utils/api";

export default function HintScreen() {
    const { navigate, team, setTeam, currentLocationId } = useApp();
    const [confirmed, setConfirmed] = useState(false);
    const [hintText, setHintText] = useState("");
    const [loadingHint, setLoadingHint] = useState(false);

    const useHint = async () => {
        if (!currentLocationId) {
            alert("No current location available.");
            return;
        }
        setLoadingHint(true);
        try {
            const res = await api.get(`/qrCode/getPuzzleHint/${currentLocationId}`);
            setHintText(res.data.data.puzzleHint);

            try {
                const progressRes = await api.get("/teamProgress/progress");
                const pd = progressRes.data.data;
                if (pd) {
                    setTeam(t => ({ ...t, score: pd.score, hintsUsed: pd.hintsUsed || 0 }));
                }
            } catch (e) { /* ignore */ }

            setConfirmed(true);
        } catch (err) {
            console.error("Failed to fetch hint", err);
            alert(err.response?.data?.message || "Could not fetch hint");
        } finally {
            setLoadingHint(false);
        }
    };

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar title="Puzzle Hint" back="puzzle" />
            <div
                style={{
                    padding: "40px 20px",
                    maxWidth: 420,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                {!confirmed ? (
                    <>
                        <div className="fade-up" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: 20,
                                    marginBottom: 8,
                                }}
                            >
                                Request a Puzzle Hint?
                            </div>
                            <div
                                style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}
                            >
                                Using a puzzle hint will deduct{" "}
                                <span style={{ color: "var(--danger)", fontWeight: 600 }}>
                                    5 points
                                </span>{" "}
                                from your team's score.
                            </div>
                        </div>

                        <div
                            className="fade-up-2 card"
                            style={{
                                display: "grid",
                                gridTemplateColumns: window.innerWidth <= 480 ? "1fr" : "1fr 1fr",
                                gap: window.innerWidth <= 480 ? 12 : 8,
                                textAlign: "center",
                                padding: 16,
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
                                    Current Score
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontWeight: 700,
                                        fontSize: 24,
                                        color: "var(--text)",
                                        marginTop: 4,
                                    }}
                                >
                                    {team.score}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "var(--muted)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    After Hint
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontWeight: 700,
                                        fontSize: 24,
                                        color: "var(--danger)",
                                        marginTop: 4,
                                    }}
                                >
                                    {Math.max(0, team.score - 5)}
                                </div>
                            </div>
                        </div>

                        <div
                            className="fade-up-3"
                            style={{ display: "flex", flexDirection: "column", gap: 10 }}
                        >
                            <button className="btn-primary" onClick={useHint} disabled={loadingHint}>
                                {loadingHint ? "Fetching..." : "Yes, Show Puzzle Hint (−5 pts)"}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => navigate("puzzle")}
                            >
                                Cancel — I'll Try Again
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="fade-up" style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--danger)",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    marginBottom: 8,
                                }}
                            >
                                −5 pts deducted
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                Here's Your Puzzle Hint
                            </div>
                        </div>

                        <div
                            className="fade-up-2 card"
                            style={{ borderLeft: "3px solid var(--accent)", padding: 20 }}
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
                                Hint
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                }}
                            >
                                "{hintText}"
                            </div>
                        </div>

                        <button
                            className="btn-primary fade-up-3"
                            onClick={() => navigate("puzzle")}
                        >
                            ← Back to Puzzle
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}