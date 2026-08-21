import { useEffect, useState } from 'react';
import API from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  durationDays: '',
  features: '',
  isActive: true,
};

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPlans = async () => {
    const res = await API.get('/memberships/admin/all');
    setPlans(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await API.put(`/memberships/admin/${editingId}`, payload);
        setMessage('Plan updated successfully!');
      } else {
        await API.post('/memberships/admin', payload);
        setMessage('Plan created successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      durationDays: plan.durationDays,
      features: plan.features?.join(', ') || '',
      isActive: plan.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this membership plan?')) return;
    try {
      await API.delete(`/memberships/admin/${id}`);
      setMessage('Plan deleted.');
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Membership Plan Management</h2>
          <p className="text-muted mb-0">Create and manage membership packages</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          {showForm ? 'Close Form' : 'Add Plan'}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card p-4 mb-4">
          <h5>{editingId ? 'Edit Plan' : 'Create New Plan'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Price (৳)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Duration (days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Features (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Gym access, Locker room, Group classes"
              />
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="planActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="planActive">
                Active
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Plan' : 'Create Plan'}
            </button>
          </form>
        </div>
      )}

      <div className="table-card p-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Features</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>৳{p.price}</td>
                  <td>{p.durationDays} days</td>
                  <td>{p.features?.join(', ') || '—'}</td>
                  <td>
                    <span className={`badge ${p.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;
