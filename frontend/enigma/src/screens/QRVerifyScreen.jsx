import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/common/TopBar";
import { Html5Qrcode } from "html5-qrcode";
import api from "../utils/api";

export default function QRVerifyScreen() {
  const { navigate, setPuzzleData, setCurrentLocationId, team, setTeam, setGameCompleted, gameCompleted, setPrevScore } = useApp();
  const [status, setStatus] = useState("idle"); // idle | checking | correct | wrong
  const [errorMsg, setErrorMsg] = useState("");
  const [qrPoints, setQrPoints] = useState(0);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Instantiate raw Html5Qrcode to get rid of default UI buttons
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const onScanSuccess = async (decodedText) => {
      // Prevent rapid-fire scanning
      if (html5QrCode.getState() !== 2) return; // 2 = SCANNING

      try {
        await html5QrCode.pause(true); // Pause the video feed while we verify
      } catch (e) {
        console.warn("Pause failed", e);
      }

      setStatus("checking");
      setErrorMsg("");

      // The QR code could be just the MongoDB LocId or a full URL.
      const scannedLocId = decodedText.trim();

      try {
        const res = await api.get(`/qrCode/checkQrLocation/${scannedLocId}`);

        setStatus("correct");
        try { await html5QrCode.stop(); } catch (e) { }

        // Check if game completed on this QR scan (returned to base camp)
        if (res.data.data?.gameCompleted) {
          try {
            const progressRes = await api.get("/teamProgress/progress");
            const pd = progressRes.data.data;
            const finalScore = pd?.score ?? team.score + 10;
            setQrPoints(finalScore - team.score);
            setPrevScore(team.score);
            setTeam((t) => ({ ...t, score: finalScore }));
          } catch (e) {
            setQrPoints(10);
            setPrevScore(team.score);
            setTeam((t) => ({ ...t, score: t.score + 10 }));
          }
          setGameCompleted(true);
          setTimeout(() => navigate("next-clue"), 2500);
          return;
        }

        // Normal round — re-fetch progress for updated score/round
        try {
          const progressRes = await api.get("/teamProgress/progress");
          const pd = progressRes.data.data;
          if (pd && !pd.completed) {
            const earned = pd.score - team.score;
            setQrPoints(earned);
            setPuzzleData(res.data.data);
            setCurrentLocationId(scannedLocId);
            setTeam((t) => ({
              ...t,
              score: pd.score,
              round: pd.currentRound ?? t.round,
              clue: pd.clue || t.clue,
              hintsUsed: pd.hintsUsed || 0,
            }));
          } else {
            setQrPoints(10);
            setPuzzleData(res.data.data);
            setCurrentLocationId(scannedLocId);
          }
        } catch (e) {
          setQrPoints(10);
          setPuzzleData(res.data.data);
          setCurrentLocationId(scannedLocId);
        }
        setTimeout(() => navigate("dashboard"), 2500);

      } catch (err) {
        console.error("QR Verification Failed", err);

        setStatus("wrong");
        setErrorMsg(err.response?.data?.message || "Location verification failed");

        // Let them read the error, then resume the camera
        setTimeout(() => {
          if (scannerRef.current?.getState() === 3) { // 3 = PAUSED
            setStatus("idle");
            html5QrCode.resume();
          }
        }, 3000);
      }
    };

    const config = { fps: 10, qrbox: { width: 220, height: 220 } };

    // Start immediately with the back camera ("environment")
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
      .catch((err) => {
        console.error("Camera start failed", err);
        setStatus("wrong");
        setErrorMsg("Failed to access camera. Please allow permissions.");
      });

    return () => {
      // Ensure the camera turns off when they navigate away
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error("Stop error", e));
      }
    };
  }, [navigate]);

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <TopBar title="QR Verification" back="dashboard" />
      <div
        style={{
          padding: "40px 20px",
          maxWidth: 420,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div className="fade-up" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Scan Location QR Code
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
            Point your camera at the QR code at your current location. The system will verify you're in the right place.
          </div>
        </div>

        {/* The target div for Html5Qrcode - Let the library control width/height internally */}
        <div
          className="fade-up card"
          style={{ width: "100%", padding: 0, overflow: "hidden", border: "2px solid var(--border)", position: "relative" }}
        >
          <div id="qr-reader" style={{ width: "100%", margin: "0 auto", border: "none" }}></div>

          {/* Overlays for status */}
          {status === "checking" && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div className="spin" style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "var(--accent)", borderRadius: "50%", marginBottom: 12 }} />
              <div style={{ color: "white", fontSize: 13, fontFamily: "var(--font-mono)" }}>VERIFYING...</div>
            </div>
          )}

          {status === "correct" && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(94,232,160,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
              <div style={{ fontSize: 48 }}>✅</div>
              {qrPoints > 0 && (
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "white", marginTop: 8 }}>
                  +{qrPoints} pts
                </div>
              )}
            </div>
          )}

          {status === "wrong" && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(232,94,94,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, zIndex: 10 }}>
              ❌
            </div>
          )}
        </div>

        {status === "wrong" && (
          <div className="card fade-up" style={{ border: "1px solid var(--danger)", background: "rgba(232,94,94,0.06)", width: "100%", textAlign: "center" }}>
            <div style={{ color: "var(--danger)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 6 }}>
              Wrong Location
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {errorMsg}
            </div>
          </div>
        )}

        {status === "correct" && (
          <div className="card fade-up" style={{ border: "1px solid var(--accent2)", background: "rgba(94,232,160,0.06)", width: "100%", textAlign: "center" }}>
            <div style={{ color: "var(--accent2)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 6 }}>
              {gameCompleted ? "Hunt Complete!" : "Location Verified!"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {gameCompleted ? "Finalizing your score\u2026" : `+${qrPoints} pts \u2014 Heading to dashboard\u2026`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}