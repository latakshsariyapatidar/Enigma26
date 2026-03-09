const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Mono', monospace; background: #0a0a0f; color: #e8e4d9; }
    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --surface2: #1a1a26;
      --border: #2a2a3a;
      --accent: #298c0d;
      --accent2: #5ee8a0;
      --danger: #e85e5e;
      --text: #e8e4d9;
      --muted: #7a7a9a;
      --font-display: 'Syne', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(232,197,71,0.4); }
      70% { box-shadow: 0 0 0 12px rgba(232,197,71,0); }
      100% { box-shadow: 0 0 0 0 rgba(232,197,71,0); }
    }
    @keyframes scan {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(120px); opacity: 0; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes ticker {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .fade-up { animation: fadeUp 0.4s ease forwards; }
    .fade-up-2 { animation: fadeUp 0.4s 0.1s ease both; }
    .fade-up-3 { animation: fadeUp 0.4s 0.2s ease both; }
    .fade-up-4 { animation: fadeUp 0.4s 0.3s ease both; }
    .pulse-btn { animation: pulse-ring 2s infinite; }
    .scan-line { animation: scan 1.5s ease-in-out infinite; }
    .spin { animation: spin 1s linear infinite; }
    .ticker-text { animation: ticker 18s linear infinite; }
    input, textarea {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 14px;
      padding: 10px 14px;
      width: 100%;
      outline: none;
      border-radius: 2px;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus { border-color: var(--accent); }
    input::placeholder { color: var(--muted); }
    .btn-primary {
      background: var(--accent);
      color: #0a0a0f;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.08em;
      padding: 12px 24px;
      border: none;
      cursor: pointer;
      width: 100%;
      text-transform: uppercase;
      transition: all 0.15s;
      border-radius: 2px;
    }
    .btn-primary:hover { background: #74d35aff; transform: translateY(-1px); }
    .btn-secondary {
      background: transparent;
      color: var(--text);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.06em;
      padding: 11px 24px;
      border: 1px solid var(--border);
      cursor: pointer;
      width: 100%;
      text-transform: uppercase;
      transition: all 0.15s;
      border-radius: 2px;
    }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
    .btn-danger {
      background: transparent;
      color: var(--danger);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.06em;
      padding: 11px 24px;
      border: 1px solid var(--danger);
      cursor: pointer;
      width: 100%;
      text-transform: uppercase;
      transition: all 0.15s;
      border-radius: 2px;
    }
    .btn-danger:hover { background: rgba(232,94,94,0.1); }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 20px;
    }
    .tag {
      display: inline-block;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 11px;
      letter-spacing: 0.08em;
      padding: 3px 10px;
      text-transform: uppercase;
      border-radius: 2px;
    }
    .screen { min-height: 100vh; padding: 0; position: relative; overflow: hidden; }
    .noise {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: 0.4;
    }
    .glow { box-shadow: 0 0 40px rgba(232,197,71,0.08); }
    .accent-line { height: 2px; background: var(--accent); width: 32px; }
    .dot-grid {
      background-image: radial-gradient(circle, #2a2a3a 1px, transparent 1px);
      background-size: 24px 24px;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  `}</style>
);

export default FontLink;