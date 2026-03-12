import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";
import StatCard from "../components/common/StatCard";
import AssignedRoute from "../components/admin/AssignedRoute";
import RoundLog from "../components/admin/RoundLog";
import api from "../utils/api";

export default function AdminTeamDetailScreen() {
    const { navigate, selectedAdminTeam } = useApp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            if (!selectedAdminTeam) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/admin/team/${selectedAdminTeam}`);
                setData(res.data.data);
            } catch (err) {
                console.error("Failed to load team details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamData();
    }, [selectedAdminTeam]);

    if (loading || !data) {
        return (
            <div className="screen" style={{ background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "var(--muted)" }}>Loading team details...</div>
            </div>
        );
    }

    const { summary, roundLogs, route } = data;
    const mappedRoute = route.map(r => r.name);
    // mappedRoute for AssignedRoute requires array of strings if that's how dummydata did it.
    // Wait, let's pass route directly if it was just names

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar title={`Team: ${summary.teamName || summary.name || summary.teamId}`} back="admin-dashboard" />
            <div style={{ padding: "16px", maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="fade-up" style={{ display: "grid", gridTemplateColumns: window.innerWidth <= 480 ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
                    <StatCard label="Round" value={`${summary.currentRound}/${route.length}`} />
                    <StatCard label="Score" value={`${summary.totalScore} pts`} accent="var(--accent)" />
                    <StatCard label="Time" value={summary.totalTime ? new Date(summary.totalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"} />
                </div>

                <AssignedRoute route={mappedRoute} currentRound={summary.currentRound} />
                <RoundLog rounds={roundLogs.map(log => ({
                    r: log.round,
                    loc: log.location,
                    type: "Unknown", // Assuming type is not available in roundLogs easily without populating puzzle
                    attempts: log.attempts,
                    hint: log.hintsUsed > 0,
                    time: log.time ? new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
                    score: log.scoreAfter
                }))} />
            </div>
        </div>
    );
}