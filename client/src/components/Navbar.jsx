import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🫵 <span className="brand-syl">SYL.</span>GymTracker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            {user && user.role === 'member' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/workouts">
                    Workouts
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/memberships">
                    Memberships
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/bmi">
                    BMI Calculator
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/calories">
                    Calorie Calculator
                  </NavLink>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/members">
                    Members
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/plans">
                    Plans
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                {user.role === 'member' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                      Profile
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link text-light opacity-75">
                    {user.name} ({user.role})
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
