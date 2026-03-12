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
    const [eventAction, setEventAction] = useState(null);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
        } catch (err) {
            console.error("Logout error", err);
        }
        navigate("login");
    };

    const handleEventAction = async (action) => {
        setEventAction(action);
        try {
            await api.post(`/admin/${action}`);
        } catch (err) {
            console.error(`Event ${action} failed`, err);
        } finally {
            setEventAction(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                const raw = res.data.data;
                // Map leaderboard to UI-expected shape
                const mapped = {
                    ...raw,
                    leaderboard: (raw.leaderboard || []).map((t) => {
                        const statusMap = { Done: "complete", Active: "active" };
                        return {
                            ...t,
                            id: t.teamId,
                            name: t.name || t.teamId,
                            status: statusMap[t.status] || "active",
                            time: t.time ? new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
                        };
                    }),
                };
                setData(mapped);
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
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)" }} />
                            <span style={{ fontSize: 8, color: "var(--accent2)" }}>LIVE</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
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
            />

            {loading && !data ? (
                <div style={{ padding: "50px", color: "var(--muted)", textAlign: "center" }}>Loading admin data...</div>
            ) : (
                <div style={{ padding: "16px", maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Event Controls */}
                    <div className="fade-up card" style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", padding: "12px 16px", flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: window.innerWidth <= 480 ? 8 : 0 }}>Event Controls</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button className="btn-primary" style={{ padding: "5px 10px", fontSize: 10, width: "auto" }} onClick={() => handleEventAction("start-event")} disabled={!!eventAction}>
                                {eventAction === "start-event" ? "..." : "▶ Start"}
                            </button>
                            <button className="btn-danger" style={{ padding: "5px 10px", fontSize: 10, width: "auto" }} onClick={() => handleEventAction("stop-event")} disabled={!!eventAction}>
                                {eventAction === "stop-event" ? "..." : "⏹ Stop"}
                            </button>
                            <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 10, width: "auto" }} onClick={() => handleEventAction("upcoming-event")} disabled={!!eventAction}>
                                {eventAction === "upcoming-event" ? "..." : "🔄 Upcoming"}
                            </button>
                            <button className="btn-secondary" style={{ padding: "5px 10px", fontSize: 10, width: "auto" }} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="fade-up responsive-grid">
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