import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      await login("/auth/customer/login", form);
      navigate("/application");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <main className="center-page">
      <form className="card form-card" onSubmit={submit}>
        <p className="eyebrow">CUSTOMER LOGIN</p>
        <h2>Welcome back</h2>
        <FormInput label="Email" type="email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <FormInput label="Password" type="password" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <div className="alert error-box">{error}</div>}
        <button className="btn primary full">Login</button>
        <p className="muted center">Need an account? <Link to="/register">Register</Link></p>
      </form>
    </main>
  );
}