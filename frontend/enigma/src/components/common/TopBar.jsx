import { useApp } from "../../context/AppContext";

const TopBar = ({ title, right, back, onBack }) => {
  const { navigate } = useApp();
  return (
    <div
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {back && (
          <button
            onClick={onBack || (() => navigate(back))}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              cursor: "pointer",
              padding: "2px 6px",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              borderRadius: 2,
            }}
          >
            ← back
          </button>
        )}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      {right}
    </div>
  );
};

export default TopBar;