import { useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../utils/api";

export default function LoginScreen() {
  const { navigate, setTeam, setCurrentLocationId, setPuzzleData, setGameCompleted } = useApp();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !pw) {
      setErr("Please enter both Team ID and Password.");
      return;
    }
    setLoading(true);
    setErr("");

    try {
      const response = await api.post("/users/login", {
        name: id,
        password: pw,
      });

      const userData = response.data.data.user;

      // Navigate based on role
      if (userData.role === "admin") {
        navigate("admin-dashboard");
      } else {
        // Fetch progress for this team
        try {
          const progressRes = await api.get("/teamProgress/progress");
          const progressData = progressRes.data.data;

          if (progressData) {
            setCurrentLocationId(progressData.locationId || null);
            setTeam({
              id: userData.name,
              score: progressData.score || 0,
              round: progressData.currentRound ?? 0,
              totalRounds: progressData.totalRounds || 8,
              clue: progressData.clue || "",
              hintsUsed: progressData.hintsUsed || 0,
              name: userData.name,
            });
            // At round 0, puzzle comes directly from progress
            if (progressData.currentRound === 0 && progressData.puzzle) {
              setPuzzleData(progressData.puzzle);
            }
            setGameCompleted(false);
          } else {
            // Event completed (backend returns null data)
            setGameCompleted(true);
            setTeam({
              id: userData.name,
              score: 0,
              round: 0,
              totalRounds: 8,
              hintsUsed: 0,
              name: userData.name,
            });
          }
          navigate("dashboard");
        } catch (progressErr) {
          console.error("Failed to fetch progress", progressErr);
          setTeam({
            id: userData.name,
            score: 0,
            round: 0,
            totalRounds: 8,
            hintsUsed: 0,
            name: userData.name,
          });
          navigate("dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="screen dot-grid"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div className="noise" />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 380,
          padding: "0 20px",
        }}
      >
        {/* Logo */}
        <div
          className="fade-up"
          style={{ marginBottom: 40, textAlign: "center" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 45,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "var(--accent)",
            }}
          >
            ENIGMA
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.2em",
              marginTop: 6,
              textTransform: "uppercase",
            }}
          >
            Headstart 2026 — Treasure Hunt
          </div>
        </div>

        {/* Card */}
        <div className="card glow fade-up-2" style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="accent-line" style={{ marginBottom: 12 }} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Team Login
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              Enter your credentials to begin the hunt
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Team ID
              </div>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. TEAM_04"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Password
              </div>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {err && (
              <div
                style={{
                  color: "var(--danger)",
                  fontSize: 12,
                  padding: "8px 12px",
                  background: "rgba(232,94,94,0.08)",
                  border: "1px solid rgba(232,94,94,0.2)",
                  borderRadius: 2,
                }}
              >
                {err}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleLogin}
              disabled={loading}
              style={{ marginTop: 4, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verifying…" : "Enter the Hunt →"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}