import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";
import api from "../utils/api";

export default function PuzzleScreen() {
    const { navigate, team, setTeam, currentLocationId, puzzleData: ctxPuzzle, setPuzzleData, setCurrentLocationId, setGameCompleted, setPrevScore } = useApp();
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null); // null | correct | wrong
    const [attempts, setAttempts] = useState(0);
    const [puzzleData, setPuzzleLocal] = useState(ctxPuzzle);
    const [loading, setLoading] = useState(!ctxPuzzle);
    const [submitting, setSubmitting] = useState(false);
    const [gaveUp, setGaveUp] = useState(false);
    const [gaveUpAnswer, setGaveUpAnswer] = useState("");

    useEffect(() => {
        // If we already have puzzle data from QR scan or progress, use it
        if (ctxPuzzle) {
            setPuzzleLocal(ctxPuzzle);
            setLoading(false);
            return;
        }
        // Don't try QR fetch at round 0 (puzzle should come from progress)
        if (team.round === 0) {
            setLoading(false);
            return;
        }
        // Otherwise try to fetch via QR check (user navigated directly)
        const fetchPuzzle = async () => {
            if (!currentLocationId) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/qrCode/checkQrLocation/${currentLocationId}`);
                setPuzzleLocal(res.data.data);
                setPuzzleData(res.data.data);
            } catch (err) {
                console.error("Failed to fetch puzzle:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPuzzle();
    }, []);

    const submit = async () => {
        if (!answer.trim() || submitting || !currentLocationId) return;
        setSubmitting(true);
        const wasBaseCampRound = team.round === 0;
        try {
            setPrevScore(team.score);
            await api.post(`/qrCode/checkPuzzleAnswer/${currentLocationId}`, { answer: answer.trim() });
            setResult("correct");
            setPuzzleData(null);

            // Re-fetch progress to update team global state
            try {
                const progressRes = await api.get("/teamProgress/progress");
                const pd = progressRes.data.data;
                if (pd && !pd.completed) {
                    setCurrentLocationId(pd.locationId || null);
                    setTeam((t) => ({
                        ...t,
                        score: pd.score,
                        round: pd.currentRound ?? t.round,
                        clue: pd.clue || "",
                        hintsUsed: pd.hintsUsed || 0,
                    }));
                } else {
                    setGameCompleted(true);
                    if (pd?.score != null) {
                        setTeam((t) => ({ ...t, score: pd.score }));
                    }
                }
            } catch (err) {
                console.error("Failed to update progress globally after correct answer", err);
                // Fallback so base-camp solve still reflects score/round in UI.
                if (wasBaseCampRound) {
                    setTeam((t) => ({ ...t, score: t.score + 10, round: 1 }));
                }
            }
        } catch (err) {
            setResult("wrong");
            setAttempts((prev) => prev + 1);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGiveUp = async () => {
        if (!currentLocationId) return;
        const wasBaseCampRound = team.round === 0;
        try {
            setPrevScore(team.score);
            const res = await api.post(`/qrCode/giveUpPuzzle/${currentLocationId}`);
            const puzzleAnswer = res.data?.data?.puzzleAnswer || "Unknown";
            setGaveUpAnswer(puzzleAnswer);
            setGaveUp(true);
            setPuzzleData(null);
            // Re-fetch progress
            try {
                const progressRes = await api.get("/teamProgress/progress");
                const pd = progressRes.data.data;
                if (pd && !pd.completed) {
                    setCurrentLocationId(pd.locationId || null);
                    setTeam((t) => ({
                        ...t,
                        score: pd.score,
                        round: pd.currentRound ?? t.round,
                        clue: pd.clue || "",
                        hintsUsed: pd.hintsUsed || 0,
                    }));
                } else {
                    setGameCompleted(true);
                    if (pd?.score != null) {
                        setTeam((t) => ({ ...t, score: pd.score }));
                    }
                }
            } catch (e) {
                if (wasBaseCampRound) {
                    setTeam((t) => ({ ...t, score: t.score - 5, round: 1 }));
                }
            }
        } catch (err) {
            console.error("Give up failed", err);
            alert(err.response?.data?.message || "Give up failed");
        }
    };

    if (loading) {
        return (
            <div className="screen" style={{ background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "var(--accent)" }}>Loading puzzle...</div>
            </div>
        );
    }

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar
                title={`Round ${team.round} — Puzzle`}
                back="dashboard"
                right={<span className="tag">{team.score} pts</span>}
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
                <div
                    className="fade-up"
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                    <span className="tag">{puzzleData?.type || "Puzzle"}</span>
                    <span className="tag">
                        Round {team.round} / {team.totalRounds}
                    </span>
                    {attempts > 0 && (
                        <span
                            className="tag"
                            style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                        >
                            {attempts} attempt{attempts > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Puzzle content */}
                <div
                    className="fade-up-2 card"
                    style={{ borderTop: "2px solid var(--accent)", padding: 24 }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: "var(--accent)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: 14,
                        }}
                    >
                        Your Puzzle
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            lineHeight: 1.7,
                            color: "var(--text)",
                        }}
                    >
                        {puzzleData?.text || "No puzzle content found."}
                    </div>
                    {/* Puzzle image */}
                    {puzzleData?.image && (
                        <img
                            src={puzzleData.image}
                            alt="Puzzle"
                            style={{
                                marginTop: 16,
                                width: "100%",
                                borderRadius: 2,
                                border: "1px solid var(--border)",
                            }}
                        />
                    )}
                    {/* Puzzle audio */}
                    {puzzleData?.audio && (
                        <audio controls src={puzzleData.audio} style={{ marginTop: 12, width: "100%" }} />
                    )}
                </div>

                {/* Answer / Give-up section */}
                {gaveUp ? (
                    <div className="fade-up-3 card" style={{ textAlign: "center", padding: 24 }}>
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--danger)",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                marginBottom: 8,
                            }}
                        >
                            Puzzle Skipped — −5 pts
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: 18,
                                marginBottom: 12,
                            }}
                        >
                            The Answer Was:
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 20,
                                color: "var(--accent)",
                                padding: 12,
                                background: "rgba(232,197,71,0.06)",
                                border: "1px solid rgba(232,197,71,0.2)",
                                borderRadius: 2,
                                marginBottom: 16,
                            }}
                        >
                            {gaveUpAnswer}
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => { setPuzzleData(null); navigate("next-clue"); }}
                            style={{ width: "100%" }}
                        >
                            Continue →
                        </button>
                    </div>
                ) : (
                    <div className="fade-up-3 card">
                        <div
                            style={{
                                fontSize: 11,
                                color: "var(--muted)",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                marginBottom: 8,
                            }}
                        >
                            Your Answer
                        </div>
                        <input
                            value={answer}
                            className="lowercase border p-2"
                            onChange={(e) => {
                                setAnswer(e.target.value);
                                setResult(null);
                            }}
                            placeholder="Type your answer here…"
                            onKeyDown={(e) => e.key === "Enter" && submit()}
                            disabled={result === "correct" || submitting}
                        />

                        {result === "wrong" && (
                            <div
                                style={{
                                    marginTop: 10,
                                    color: "var(--danger)",
                                    fontSize: 12,
                                    padding: "8px 12px",
                                    background: "rgba(232,94,94,0.07)",
                                    border: "1px solid rgba(232,94,94,0.2)",
                                    borderRadius: 2,
                                }}
                            >
                                ✗ Incorrect — try again!
                            </div>
                        )}
                        {result === "correct" && (
                            <div
                                style={{
                                    marginTop: 10,
                                    color: "var(--accent2)",
                                    fontSize: 12,
                                    padding: "8px 12px",
                                    background: "rgba(94,232,160,0.07)",
                                    border: "1px solid rgba(94,232,160,0.2)",
                                    borderRadius: 2,
                                }}
                            >
                                ✓ Correct! Well done!
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                            {result !== "correct" ? (
                                <button
                                    className="btn-primary"
                                    onClick={submit}
                                    style={{ flex: 2 }}
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Answer"}
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    onClick={() => { setPuzzleData(null); navigate("next-clue"); }}
                                    style={{ flex: 2 }}
                                >
                                    See Next Clue →
                                </button>
                            )}
                            <button
                                className="btn-secondary"
                                onClick={() => navigate("hint")}
                                style={{ flex: 1, fontSize: 11 }}
                            >
                                💡 Hint
                            </button>
                        </div>
                        {result !== "correct" && (
                            <button
                                className="btn-danger"
                                onClick={handleGiveUp}
                                style={{ marginTop: 10, width: "100%", fontSize: 11 }}
                            >
                                🏳️ Give Up (−5 pts)
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}