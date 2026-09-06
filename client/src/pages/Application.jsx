import { useState } from "react";
import FormInput from "../components/FormInput";
import { api } from "../services/api";

const initial = {
  firstName: "", lastName: "", email: "", gender: "",
  mobileNumber: "", address: "", feedback: ""
};

export default function Application() {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/submissions", form);
      setForm(initial);
      setMessage("Your application was submitted successfully.");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || "Unable to submit application.");
    }
  };

  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CUSTOMER APPLICATION</p>
          <h1>Submit your details</h1>
          <p className="muted">All required information is validated before saving.</p>
        </div>
      </div>

      <form className="card application-grid" onSubmit={submit}>
        <FormInput label="First name" name="firstName" required value={form.firstName} onChange={update} />
        <FormInput label="Last name" name="lastName" required value={form.lastName} onChange={update} />
        <FormInput label="Email" name="email" type="email" required value={form.email} onChange={update} />

        <label className="field">
          <span>Gender</span>
          <select name="gender" required value={form.gender} onChange={update}>
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <FormInput label="Mobile number" name="mobileNumber" required value={form.mobileNumber} onChange={update}
          placeholder="07XXXXXXXX or +947XXXXXXXX" />

        <label className="field full-span">
          <span>Address</span>
          <textarea name="address" required rows="3" value={form.address} onChange={update} />
        </label>

        <label className="field full-span">
          <span>Feedback <em>Optional</em></span>
          <textarea name="feedback" rows="4" value={form.feedback} onChange={update} />
        </label>

        {message && <div className="alert success-box full-span">{message}</div>}
        {error && <div className="alert error-box full-span">{error}</div>}
        <div className="full-span"><button className="btn primary">Submit Application</button></div>
      </form>
    </main>
  );
}