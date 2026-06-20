import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="brand" to="/">
          <span className="brand-mark">B</span>
          <span>BrandFoundry</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/dashboard">Startups</NavLink>
          <NavLink to="/create-startup">Create</NavLink>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="user-link" to="/login">
                {user.picture ? (
                  <img src={user.picture} alt="" />
                ) : (
                  <span>{user.name?.charAt(0) || "U"}</span>
                )}
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="button button-ghost button-small" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <Link className="button button-primary button-small" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
