import { useEffect, useState } from 'react';
import API from '../../services/api';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  age: '',
  gender: '',
  isActive: true,
};

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchMembers = async (query = '') => {
    const res = await API.get('/admin/members', { params: { search: query } });
    setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        const payload = { ...form, age: form.age ? Number(form.age) : undefined };
        delete payload.password;
        await API.put(`/admin/members/${editingId}`, payload);
        setMessage('Member updated successfully!');
      } else {
        await API.post('/admin/members', {
          ...form,
          age: form.age ? Number(form.age) : undefined,
        });
        setMessage('Member created successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchMembers(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      email: member.email,
      password: '',
      phone: member.phone || '',
      age: member.age || '',
      gender: member.gender || '',
      isActive: member.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member and all their workouts?')) return;
    try {
      await API.delete(`/admin/members/${id}`);
      setMessage('Member deleted.');
      fetchMembers(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const toggleActive = async (member) => {
    try {
      await API.put(`/admin/members/${member._id}`, { isActive: !member.isActive });
      fetchMembers(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
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
          <h2>Member Management</h2>
          <p className="text-muted mb-0">Add, update, delete, and search members</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          {showForm ? 'Close Form' : 'Add Member'}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card p-4 mb-4">
          <h5>{editingId ? 'Edit Member' : 'Add New Member'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            {!editingId && (
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  required
                />
              </div>
            )}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {editingId && (
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active
                </label>
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Member' : 'Create Member'}
            </button>
          </form>
        </div>
      )}

      <form className="mb-3" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      <div className="table-card p-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone || '—'}</td>
                  <td>{m.membershipPlan?.name || '—'}</td>
                  <td>
                    <span className={`badge ${m.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => toggleActive(m)}
                    >
                      {m.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(m._id)}
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

export default MemberManagement;
