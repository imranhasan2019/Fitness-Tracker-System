import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

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
        <h2>Admin Dashboard</h2>
        <p className="text-muted mb-0">System overview and statistics</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card stat-card p-4 text-center">
            <h6 className="text-muted">Total Members</h6>
            <h2>{stats?.totalMembers}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-4 text-center">
            <h6 className="text-muted">Active Members</h6>
            <h2 className="text-success">{stats?.activeMembers}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-4 text-center">
            <h6 className="text-muted">Membership Plans</h6>
            <h2>{stats?.totalPlans}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-4 text-center">
            <h6 className="text-muted">Total Workouts</h6>
            <h2>{stats?.totalWorkouts}</h2>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <Link to="/admin/members" className="btn btn-primary">
          Manage Members
        </Link>
        <Link to="/admin/plans" className="btn btn-outline-primary">
          Manage Plans
        </Link>
      </div>

      <div className="table-card p-4">
        <h5>Recent Members</h5>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentMembers?.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.membershipPlan?.name || '—'}</td>
                  <td>
                    <span className={`badge ${m.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
