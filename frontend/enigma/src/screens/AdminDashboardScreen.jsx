import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";
import StatCard from "../components/common/StatCard";
import LeaderboardTable from "../components/admin/LeaderBoardTable";
import HintUsage from "../components/admin/HintUsage";
import api from "../utils/api";

export default function AdminDashboardScreen() {
    const { navigate } = useApp();
    const [selected, setSelected] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                setData(res.data.data);
            } catch (err) {
                console.error("Failed to load admin dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const statusColor = {
        complete: "var(--accent2)",
        active: "var(--accent)",
        stuck: "var(--danger)",
    };
    const statusLabel = {
        complete: "✅ Done",
        active: "🏃 Active",
        stuck: "🐌 Stuck",
    };

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar
                title="Organizer Dashboard"
                right={
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)" }} />
                        <span style={{ fontSize: 8, color: "var(--accent2)" }}>LIVE</span>
                        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                            <button
                                className="btn-secondary"
                                onClick={() => navigate("admin-teams")}
                                style={{ width: "auto", padding: "3px 5px", fontSize: 11 }}
                            >
                                👥 Teams
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => navigate("admin-locations")}
                                style={{ width: "auto", padding: "3px 5px", fontSize: 11 }}
                            >
                                📍 Locs
                            </button>
                        </div>
                    </div>
                }
                back="login"
            />

            {loading && !data ? (
                <div style={{ padding: "50px", color: "var(--muted)", textAlign: "center" }}>Loading admin data...</div>
            ) : (
                <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Summary */}
                    <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                        {[
                            ["Teams", data?.summary?.totalTeams || 0],
                            ["Active", (data?.summary?.totalTeams || 0) - (data?.summary?.finishedTeams || 0)],
                            ["Done", data?.summary?.finishedTeams || 0],
                            ["Avg Score", data?.leaderboard?.length ? Math.round(data.leaderboard.reduce((a, t) => a + t.score, 0) / data.leaderboard.length) : 0],
                        ].map(([l, v]) => (
                            <StatCard key={l} label={l} value={v} />
                        ))}
                    </div>

                    <LeaderboardTable
                        sorted={data?.leaderboard || []}
                        selected={selected}
                        setSelected={setSelected}
                        statusColor={statusColor}
                        statusLabel={statusLabel}
                        navigate={navigate}
                    />

                    <HintUsage teams={data?.leaderboard || []} />
                </div>
            )}
        </div>
    );
}