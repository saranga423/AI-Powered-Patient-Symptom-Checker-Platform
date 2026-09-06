import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">FULL-STACK APPLICATION PORTAL</p>
          <h1>Simple, secure <span>application management.</span></h1>
          <p className="hero-copy">
            A complete customer submission workflow with authentication,
            role-based access, validation, search, filtering and administration.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/register">Create Customer Account</Link>
            <Link className="btn secondary" to="/admin/login">Admin Portal</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat"><strong>JWT</strong><span>Authentication</span></div>
          <div className="stat"><strong>CRUD</strong><span>Management</span></div>
          <div className="stat"><strong>RBAC</strong><span>Authorization</span></div>
        </div>
      </section>
    </main>
  );
}