import { useState } from "react";
import TopBar from "../components/common/TopBar";
import Field from "../components/common/Field";
import api from "../utils/api";

export default function AdminTeamManagerScreen() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "participant" });
    const [saved, setSaved] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSaved(false);

        if (!form.name || !form.email || !form.password || !form.role) {
            setErrorMsg("All fields are required.");
            return;
        }

        if (form.password.length < 8) {
            setErrorMsg("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/users/signup", form);
            setSaved(true);
            setForm({ name: "", email: "", password: "", role: "participant" });
        } catch (err) {
            console.error("Signup failed", err);
            setErrorMsg(err.response?.data?.message || "Failed to create team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen" style={{ background: "var(--bg)" }}>
            <TopBar title="Manage Teams" back="admin-dashboard" />

            <div style={{ padding: "16px", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="fade-up card">
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                        Create New Account
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.5 }}>
                        Register new participants or organizers for the Treasure Hunt event.
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="Team / Admin Name" name="name" placeholder="e.g. Scavengers" required form={form} setForm={setForm} />
                        <Field label="Email Address" name="email" placeholder="e.g. team@example.com" required form={form} setForm={setForm} />

                        <div>
                            <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                                Password <span style={{ color: "var(--accent)" }}>*</span>
                            </div>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>

                        <div>
                            <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                                Role <span style={{ color: "var(--accent)" }}>*</span>
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text)" }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="participant"
                                        checked={form.role === "participant"}
                                        onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                                    />
                                    Participant
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text)" }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={form.role === "admin"}
                                        onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                                    />
                                    Organizer
                                </label>
                            </div>
                        </div>

                        {errorMsg && (
                            <div style={{ fontSize: 12, color: "var(--danger)", padding: "10px 14px", border: "1px solid rgba(232,94,94,0.2)", background: "rgba(232,94,94,0.06)", borderRadius: 2 }}>
                                ⚠ {errorMsg}
                            </div>
                        )}

                        {saved && (
                            <div style={{ fontSize: 12, color: "var(--accent2)", padding: "10px 14px", border: "1px solid rgba(94,232,160,0.2)", background: "rgba(94,232,160,0.06)", borderRadius: 2 }}>
                                ✅ Account registered successfully!
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginTop: 10, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
