import TopBar from "../common/TopBar";
import Field from "../common/Field";

export default function LocationForm({ view, form, setForm, saved, errorMsg, editing, locationsLength, saveLocation, setView }) {
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
                        <Field label="Puzzle Text" name="puzzle" placeholder="Enter the puzzle question (text only, or with image below)…" textarea form={form} setForm={setForm} />

                        <div>
                            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                                Puzzle Image <span style={{ fontSize: 10, opacity: 0.7 }}>(optional - shown if no text or alongside text)</span>
                            </div>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "var(--accent2)";
                                    e.currentTarget.style.background = "rgba(94,232,160,0.05)";
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.background = "transparent";
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.background = "transparent";
                                    const file = e.dataTransfer.files[0];
                                    if (file && file.type.startsWith("image/")) {
                                        setForm((f) => ({ ...f, puzzleImageFile: file }));
                                    } else {
                                        alert("Please drop an image file (PNG, JPG, etc.)");
                                    }
                                }}
                                style={{ border: "2px dashed var(--border)", borderRadius: 2, padding: "24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setForm((f) => ({ ...f, puzzleImageFile: file }));
                                    }}
                                    style={{ display: "none" }}
                                    id="puzzleImageInput"
                                />
                                <label htmlFor="puzzleImageInput" style={{ cursor: "pointer", display: "block" }}>
                                    {form.puzzleImageFile ? (
                                        <>
                                            <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                                            <div style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 600 }}>{form.puzzleImageFile.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{(form.puzzleImageFile.size / 1024).toFixed(1)} KB</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, opacity: 0.6 }}>Click to change or drag new image</div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                                            <div style={{ fontSize: 12, color: "var(--muted)" }}>Click to upload or drag & drop</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, opacity: 0.6 }}>PNG, JPG, GIF up to 5MB</div>
                                        </>
                                    )}
                                </label>
                            </div>
                            {form.puzzleImageFile && (
                                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                    <button
                                        onClick={() => setForm((f) => ({ ...f, puzzleImageFile: null }))}
                                        style={{ padding: "6px 12px", fontSize: 11, background: "var(--danger)", color: "white", border: "none", borderRadius: 2, cursor: "pointer" }}
                                    >
                                        Remove Image
                                    </button>
                                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Image will be uploaded to Cloudinary on save</div>
                                </div>
                            )}
                        </div>

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
                {(!form.name || !form.qrId || !form.clue || !form.answer || (!form.puzzle && !form.puzzleImageFile)) && (
                    <div style={{ fontSize: 12, color: "var(--danger)", padding: "10px 14px", border: "1px solid rgba(232,94,94,0.2)", background: "rgba(232,94,94,0.06)", borderRadius: 2 }}>
                        ⚠ Fields marked with * are required. Puzzle must have either text or image (or both).
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