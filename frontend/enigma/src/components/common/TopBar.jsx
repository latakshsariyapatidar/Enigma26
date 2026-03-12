import { useApp } from "../../context/AppContext";

const TopBar = ({ title, right, back, onBack }) => {
  const { navigate } = useApp();
  return (
    <div
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
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
              flexShrink: 0,
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {right}
      </div>
    </div>
  );
};

export default TopBar;