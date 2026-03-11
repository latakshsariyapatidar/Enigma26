export default function Field({ label, name, placeholder, textarea, required, form, setForm }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: required ? "var(--accent)" : "var(--muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 6,
          display: "flex",
          gap: 4,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </div>
      {textarea ? (
        <textarea
          rows={3}
          value={form[name] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          style={{ resize: "vertical", minHeight: 70 }}
        />
      ) : (
        <input
          value={form[name] || ""}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}