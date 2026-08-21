import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const BMICalculator = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ height: '', weight: '', saveToProfile: true });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      height: user?.height || '',
      weight: user?.weight || '',
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/users/bmi', {
        height: Number(form.height),
        weight: Number(form.weight),
        saveToProfile: form.saveToProfile,
      });
      setResult(res.data);
      if (form.saveToProfile) await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = {
    Underweight: 'warning',
    Normal: 'success',
    Overweight: 'warning',
    Obese: 'danger',
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>BMI Calculator</h2>
        <p className="text-muted mb-0">Calculate your Body Mass Index</p>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-md-5">
          <div className="card p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  min="50"
                  max="300"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  min="20"
                  max="500"
                  required
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="saveProfile"
                  checked={form.saveToProfile}
                  onChange={(e) => setForm({ ...form, saveToProfile: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="saveProfile">
                  Save to profile
                </label>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate BMI'}
              </button>
            </form>
          </div>
        </div>

        {result && (
          <div className="col-md-5">
            <div className="card p-4 text-center">
              <h5>Your Result</h5>
              <div className="bmi-result">{result.bmi}</div>
              <span className={`badge bg-${categoryColor[result.category] || 'secondary'} fs-6 mb-3`}>
                {result.category}
              </span>
              <p className="text-muted mb-0">
                Height: {result.height} cm | Weight: {result.weight} kg
              </p>
              <hr />
              <small className="text-muted">
                Underweight: &lt;18.5 | Normal: 18.5–24.9 | Overweight: 25–29.9 | Obese: ≥30
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;
