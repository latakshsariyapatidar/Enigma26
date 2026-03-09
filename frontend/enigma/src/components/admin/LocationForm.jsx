import TopBar from "../common/TopBar";
import Field from "../common/Field";

export default function LocationForm({ view, form, setForm, PUZZLE_TYPES, saved, errorMsg, editing, locationsLength, saveLocation, setView }) {
    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar
                title={editing ? "Edit Location" : "Add New Location"}
                back="list"
                onBack={() => setView("list")}
                right={<span className="tag">{locationsLength} total</span>}
            />
            <div style={{ padding: "16px", maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 40 }}>
                {/* Basic Info */}
                <div className="fade-up card">
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--accent)" }}>01</span> Basic Info
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Field label="Location Name" name="name" placeholder="e.g. Library, Main Gate…" required form={form} setForm={setForm} />
                        <Field label="QR Code ID" name="qrId" placeholder="e.g. QR_004 (unique identifier)" required form={form} setForm={setForm} />
                    </div>
                </div>

                {/* Clue Section */}
                <div className="fade-up-2 card" style={{ borderLeft: "3px solid var(--accent)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--accent)" }}>02</span> Clue
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Field label="Clue Text" name="clue" placeholder="The clue teams see after solving previous puzzle…" textarea required form={form} setForm={setForm} />
                        <Field label="Clue Hint" name="clueHint" placeholder="Simpler clue shown if team requests hint for this clue (−5 pts)" textarea form={form} setForm={setForm} />
                    </div>
                </div>

                {/* Puzzle Section */}
                <div className="fade-up-3 card" style={{ borderLeft: "3px solid var(--accent2)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--accent2)" }}>03</span> Puzzle
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                                Puzzle Type <span style={{ color: "var(--accent)" }}>*</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {PUZZLE_TYPES.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setForm((f) => ({ ...f, puzzleType: t }))}
                                        style={{
                                            padding: "7px 16px", border: `1px solid ${form.puzzleType === t ? "var(--accent2)" : "var(--border)"}`,
                                            background: form.puzzleType === t ? "rgba(94,232,160,0.1)" : "transparent",
                                            color: form.puzzleType === t ? "var(--accent2)" : "var(--muted)",
                                            cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)", borderRadius: 2, textTransform: "capitalize", transition: "all 0.15s",
                                        }}
                                    >
                                        {t === "riddle" ? "🧩 " : t === "cipher" ? "🔐 " : t === "image" ? "🖼️ " : "🧠 "}{t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Field label="Puzzle Text" name="puzzle" placeholder={form.puzzleType === "cipher" ? "Enter the encoded message…" : form.puzzleType === "image" ? "Enter the question for the image…" : "Enter the riddle or logic question…"} textarea required form={form} setForm={setForm} />

                        {form.puzzleType === "image" && (
                            <div>
                                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Puzzle Image</div>
                                <div
                                    style={{ border: "2px dashed var(--border)", borderRadius: 2, padding: "24px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent2)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                                    onClick={() => setForm((f) => ({ ...f, hasImage: !f.hasImage }))}
                                >
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>{form.hasImage ? "🖼️" : "📁"}</div>
                                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{form.hasImage ? "Image selected (demo)" : "Click to upload image"}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, opacity: 0.6 }}>PNG, JPG up to 5MB</div>
                                </div>
                            </div>
                        )}

                        <Field label="Puzzle Hint" name="puzzleHint" placeholder="Simpler hint shown if team requests hint on this puzzle (−5 pts)" textarea form={form} setForm={setForm} />

                        <div>
                            <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                                Correct Answer <span style={{ color: "var(--accent)" }}>*</span>
                            </div>
                            <input
                                value={form.answer || ""}
                                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value.toLowerCase() }))}
                                placeholder="Case-insensitive — stored in lowercase"
                            />
                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>Answer is validated server-side, case-insensitive.</div>
                        </div>
                    </div>
                </div>

                {/* Clue-only toggle */}
                <div className="fade-up-4 card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>Clue-only Round</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>If ON, scanning QR shows next clue directly — no puzzle shown</div>
                    </div>
                    <button
                        onClick={() => setForm((f) => ({ ...f, clueOnly: !f.clueOnly }))}
                        style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: form.clueOnly ? "var(--accent2)" : "var(--border)", transition: "background 0.2s", position: "relative" }}
                    >
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form.clueOnly ? 23 : 3, transition: "left 0.2s" }} />
                    </button>
                </div>

                {errorMsg && (
                    <div style={{ fontSize: 12, color: "var(--danger)", padding: "10px 14px", border: "1px solid rgba(232,94,94,0.2)", background: "rgba(232,94,94,0.06)", borderRadius: 2 }}>
                        ⚠ {errorMsg}
                    </div>
                )}
                {(!form.name || !form.qrId || !form.clue || !form.answer) && (
                    <div style={{ fontSize: 12, color: "var(--danger)", padding: "10px 14px", border: "1px solid rgba(232,94,94,0.2)", background: "rgba(232,94,94,0.06)", borderRadius: 2 }}>
                        ⚠ Fields marked with * are required before saving.
                    </div>
                )}

                {saved && (
                    <div style={{ fontSize: 12, color: "var(--accent2)", padding: "10px 14px", border: "1px solid rgba(94,232,160,0.2)", background: "rgba(94,232,160,0.06)", borderRadius: 2 }}>
                        ✅ Location saved successfully!
                    </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={saveLocation} style={{ flex: 2 }}>{editing ? "Save Changes" : "Add Location"}</button>
                    <button className="btn-secondary" onClick={() => setView("list")} style={{ flex: 1 }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}