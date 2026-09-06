import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");

    if (form.password.length < 4) return setError("Password must be at least 4 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    try {
      await register(form);
      navigate("/application");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <main className="center-page">
      <form className="card form-card" onSubmit={submit}>
        <p className="eyebrow">CUSTOMER ACCOUNT</p>
        <h2>Create your account</h2>
        <p className="muted">Register to access the application form.</p>
        <FormInput label="Email" type="email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <FormInput label="Password" type="password" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <FormInput label="Confirm password" type="password" required value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
        {error && <div className="alert error-box">{error}</div>}
        <button className="btn primary full">Register</button>
        <p className="muted center">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
}