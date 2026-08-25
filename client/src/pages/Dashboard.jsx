import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser();
        const res = await API.get('/workouts');
        setWorkouts(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshUser]);

  const membership = user?.membershipPlan;
  const isExpired = user?.membershipExpiry && new Date(user.membershipExpiry) < new Date();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>Welcome, {user?.name}!</h2>
        <p className="text-muted mb-0">Your personal fitness dashboard</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card stat-card p-4">
            <h6 className="text-muted">Membership</h6>
            <h4>{membership?.name || 'No Plan'}</h4>
            {user?.membershipExpiry && (
              <small className={isExpired ? 'text-danger' : 'text-success'}>
                {isExpired ? 'Expired' : 'Expires'}:{' '}
                {new Date(user.membershipExpiry).toLocaleDateString()}
              </small>
            )}
            <Link to="/memberships" className="btn btn-sm btn-outline-primary mt-2">
              View Plans
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-4">
            <h6 className="text-muted">Height / Weight</h6>
            <h4>
              {user?.height || '—'} cm / {user?.weight || '—'} kg
            </h4>
            <Link to="/bmi" className="btn btn-sm btn-outline-primary mt-2">
              Calculate BMI
            </Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-4">
            <h6 className="text-muted">Recent Workouts</h6>
            <h4>{workouts.length}</h4>
            <Link to="/workouts" className="btn btn-sm btn-outline-primary mt-2">
              Track Workout
            </Link>
          </div>
        </div>
      </div>

      <div className="table-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recent Workouts</h5>
          <Link to="/workouts" className="btn btn-primary btn-sm">
            Add Workout
          </Link>
        </div>
        {workouts.length === 0 ? (
          <p className="text-muted">No workouts recorded yet. Start tracking today!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Duration (min)</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((w) => (
                  <tr key={w._id}>
                    <td>{w.exercise}</td>
                    <td>{w.duration}</td>
                    <td>{w.calories}</td>
                    <td>{new Date(w.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
