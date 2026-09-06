export default function FormInput({ label, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}