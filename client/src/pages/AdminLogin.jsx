import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      await login("/auth/admin/login", form);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed.");
    }
  };

  return (
    <main className="center-page admin-page">
      <form className="card form-card" onSubmit={submit}>
        <p className="eyebrow">ADMINISTRATOR</p>
        <h2>Admin portal</h2>
        <p className="muted">Restricted access for authorized administrators.</p>
        <FormInput label="Admin email" type="email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <FormInput label="Password" type="password" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <div className="alert error-box">{error}</div>}
        <button className="btn primary full">Sign in as Admin</button>
      </form>
    </main>
  );
}