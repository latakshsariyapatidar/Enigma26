import { useState, useEffect } from "react";
import { AppCtx } from "./context/AppContext";
import api from "./utils/api";

import FontLink from "./components/common/FontLink";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import QRVerifyScreen from "./screens/QRVerifyScreen";
import PuzzleScreen from "./screens/PuzzleScreen";
import HintScreen from "./screens/HintScreen";
import NextClueScreen from "./screens/NextClueScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import AdminTeamDetailScreen from "./screens/AdminTeamDetailScreen";
import AdminLocationManagerScreen from "./screens/AdminLocationManagerScreen";
import AdminTeamManagerScreen from "./screens/AdminTeamManagerScreen";

const SCREENS = {
  login: LoginScreen,
  dashboard: DashboardScreen,
  "qr-verify": QRVerifyScreen,
  puzzle: PuzzleScreen,
  hint: HintScreen,
  "next-clue": NextClueScreen,
  "admin-dashboard": AdminDashboardScreen,
  "admin-team-detail": AdminTeamDetailScreen,
  "admin-locations": AdminLocationManagerScreen,
  "admin-teams": AdminTeamManagerScreen,
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [team, setTeam] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [selectedAdminTeam, setSelectedAdminTeam] = useState(null);

  const navigate = (s, data = null) => {
    if (data) setSelectedAdminTeam(data);
    setScreen(s);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/users/current");
        const userData = res.data.data;

        if (userData.role === "admin") {
          navigate("admin-dashboard");
        } else {
          try {
            const progressRes = await api.get("/teamProgress/progress");
            const progressData = progressRes.data.data;
            setTeam({
              id: userData.name,
              score: progressData.score || 0,
              round: progressData.currentRound || 1,
              totalRounds: 8,
              clue: progressData.clue || "",
              name: userData.name,
            });
          } catch (err) {
            setTeam({
              id: userData.name,
              score: 0,
              round: 1,
              name: userData.name,
            });
          }
          navigate("dashboard");
        }
      } catch (err) {
        // Not logged in or session expired
        navigate("login");
      } finally {
        setLoadingApp(false);
      }
    };
    checkSession();
  }, []);

  const Screen = SCREENS[screen] || LoginScreen;

  if (loadingApp) {
    return (
      <div className="screen dot-grid" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="noise" />
        <div style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 24, zIndex: 1 }}>Loading...</div>
      </div>
    );
  }

  return (
    <AppCtx.Provider value={{ navigate, team, setTeam, selectedAdminTeam, setSelectedAdminTeam }}>
      <FontLink />
      <Screen />
    </AppCtx.Provider>
  );
}