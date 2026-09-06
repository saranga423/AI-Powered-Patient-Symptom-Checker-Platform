import { useEffect, useState } from "react";
import { api } from "../services/api";

const empty = {
  firstName: "", lastName: "", email: "", gender: "OTHER",
  mobileNumber: "", address: "", feedback: ""
};

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [editing, setEditing] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [generated, setGenerated] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get("/submissions", { params: { search, gender } });
      setItems(response.data.submissions);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load submissions.");
    }
  };

  useEffect(() => { load(); }, [search, gender]);

  const remove = async id => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await api.delete(`/submissions/${id}`);
      setMessage("Submission deleted.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  const save = async e => {
    e.preventDefault();
    try {
      await api.put(`/submissions/${editing._id}`, editing);
      setMessage("Submission updated.");
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    }
  };

  const createAdmin = async e => {
    e.preventDefault();
    setGenerated("");
    try {
      const response = await api.post("/admin/create", { email: adminEmail });
      setGenerated(response.data.generatedPassword);
      setAdminEmail("");
      setMessage("New admin created. Save the generated password securely.");
    } catch (err) {
      setError(err.response?.data?.message || "Admin creation failed.");
    }
  };

  return (
    <main className="content-page wide">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ADMIN DASHBOARD</p>
          <h1>Submission management</h1>
          <p className="muted">Review, search, filter, update and delete customer submissions.</p>
        </div>
        <div className="dashboard-count"><strong>{items.length}</strong><span>Results</span></div>
      </div>

      {message && <div className="alert success-box">{message}</div>}
      {error && <div className="alert error-box">{error}</div>}

      <section className="toolbar card">
        <input placeholder="Search first or last name…" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">All genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </section>

      <section className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Gender</th><th>Mobile</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td><strong>{item.firstName} {item.lastName}</strong></td>
                <td>{item.email}</td>
                <td><span className="badge">{item.gender}</span></td>
                <td>{item.mobileNumber}</td>
                <td>{new Date(item.dateCreated).toLocaleDateString()}</td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => setEditing({ ...item })}>Edit</button>
                  <button className="btn small danger" onClick={() => remove(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6" className="empty">No submissions found.</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="card admin-create">
        <div>
          <p className="eyebrow">ADMIN MANAGEMENT</p>
          <h2>Create an admin</h2>
          <p className="muted">The API generates a random password automatically.</p>
        </div>
        <form onSubmit={createAdmin}>
          <input type="email" required placeholder="new-admin@example.com" value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)} />
          <button className="btn primary">Create Admin</button>
        </form>
        {generated && <div className="generated"><span>Generated password</span><code>{generated}</code></div>}
      </section>

      {editing && (
        <div className="modal-backdrop">
          <form className="card modal" onSubmit={save}>
            <div className="modal-head">
              <div><p className="eyebrow">EDIT SUBMISSION</p><h2>Update details</h2></div>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)}>×</button>
            </div>
            <div className="application-grid">
              {["firstName","lastName","email","mobileNumber","address","feedback"].map(key => (
                <label className={`field ${["address","feedback"].includes(key) ? "full-span" : ""}`} key={key}>
                  <span>{key === "mobileNumber" ? "Mobile number" : key[0].toUpperCase() + key.slice(1)}</span>
                  {["address","feedback"].includes(key)
                    ? <textarea rows="3" value={editing[key] || ""} onChange={e => setEditing({...editing, [key]: e.target.value})} />
                    : <input value={editing[key] || ""} onChange={e => setEditing({...editing, [key]: e.target.value})} />}
                </label>
              ))}
              <label className="field">
                <span>Gender</span>
                <select value={editing.gender} onChange={e => setEditing({...editing, gender: e.target.value})}>
                  <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}