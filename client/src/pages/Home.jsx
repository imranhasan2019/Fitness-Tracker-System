import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <section className="hero-section">
      <div className="container text-center">
        <h1 className="display-4 fw-bold mb-3">Gym Membership & Fitness Tracker</h1>
        <p className="lead mb-4 opacity-90">
          Manage memberships, track workouts, calculate BMI, and monitor your fitness journey — all
          in one place.
        </p>
        {user ? (
          <Link
            to={user.role === 'admin' ? '/admin' : '/dashboard'}
            className="btn btn-light btn-lg px-5"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/register" className="btn btn-light btn-lg px-4">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">
              Login
            </Link>
          </div>
        )}
        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div className="card stat-card p-4 text-dark">
              <h3>🏋️</h3>
              <h5>Workout Tracker</h5>
              <p className="text-muted mb-0">Record daily exercises and view your workout history.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card stat-card p-4 text-dark">
              <h3>📋</h3>
              <h5>Membership Plans</h5>
              <p className="text-muted mb-0">Choose from flexible membership packages.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card stat-card p-4 text-dark">
              <h3>📊</h3>
              <h5>BMI Calculator</h5>
              <p className="text-muted mb-0">Track your body mass index and fitness progress.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
