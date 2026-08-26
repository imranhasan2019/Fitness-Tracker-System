import { useEffect, useState } from 'react';
import API from '../services/api';

const emptyForm = {
  exercise: '',
  duration: '',
  calories: '',
  sets: '',
  reps: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchWorkouts = async () => {
    const res = await API.get('/workouts');
    setWorkouts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    const payload = {
      exercise: form.exercise,
      duration: Number(form.duration),
      calories: form.calories ? Number(form.calories) : 0,
      sets: form.sets ? Number(form.sets) : 0,
      reps: form.reps ? Number(form.reps) : 0,
      notes: form.notes,
      date: form.date,
    };

    try {
      if (editingId) {
        await API.put(`/workouts/${editingId}`, payload);
        setMessage('Workout updated successfully!');
      } else {
        await API.post('/workouts', payload);
        setMessage('Workout recorded successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout._id);
    setForm({
      exercise: workout.exercise,
      duration: workout.duration,
      calories: workout.calories || '',
      sets: workout.sets || '',
      reps: workout.reps || '',
      notes: workout.notes || '',
      date: new Date(workout.date).toISOString().split('T')[0],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await API.delete(`/workouts/${id}`);
      setMessage('Workout deleted.');
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
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
      <div className="page-header">
        <h2>Workout Tracker</h2>
        <p className="text-muted mb-0">Record and view your workout history</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card p-4">
            <h5>{editingId ? 'Edit Workout' : 'Add Workout'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Exercise</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.exercise}
                  onChange={(e) => setForm({ ...form, exercise: e.target.value })}
                  placeholder="e.g. Bench Press"
                  required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Duration (min)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                    min="0"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Sets</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.sets}
                    onChange={(e) => setForm({ ...form, sets: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Reps</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.reps}
                    onChange={(e) => setForm({ ...form, reps: e.target.value })}
                    min="0"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Workout'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="table-card p-4">
            <h5>Workout History</h5>
            {workouts.length === 0 ? (
              <p className="text-muted">No workouts yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Duration</th>
                      <th>Calories</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((w) => (
                      <tr key={w._id}>
                        <td>{w.exercise}</td>
                        <td>{w.duration} min</td>
                        <td>{w.calories}</td>
                        <td>{new Date(w.date).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleEdit(w)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(w._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
