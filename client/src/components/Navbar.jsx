import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">Apply<span>Flow</span></Link>
      <nav>
        <Link to="/">Home</Link>
        {user?.role === "CUSTOMER" && <Link to="/application">Application</Link>}
        {user?.role === "ADMIN" && <Link to="/admin/dashboard">Dashboard</Link>}
        {!user && <Link to="/register">Register</Link>}
        {!user && <Link to="/login">Customer Login</Link>}
        {!user && <Link to="/admin/login">Admin Login</Link>}
        {user && <button className="link-button" onClick={signOut}>Logout</button>}
      </nav>
    </header>
  );
}