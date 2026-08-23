import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CalorieCalculator = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    age: user?.age || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    activity: 'moderate',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      age: user?.age || prev.age,
      gender: user?.gender || prev.gender,
      height: user?.height || prev.height,
      weight: user?.weight || prev.weight,
    }));
  }, [user]);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very: 1.9,
  };

  const categories = [
    { key: 'maintain', label: 'Maintain weight', pct: 1.0, note: '100% Calories/day' },
    { key: 'mild', label: 'Mild weight loss', pct: 0.9, note: '0.5 lb/week — 90% Calories/day' },
    { key: 'loss', label: 'Weight loss', pct: 0.8, note: '1 lb/week — 80% Calories/day' },
    { key: 'extreme', label: 'Extreme weight loss', pct: 0.61, note: '2 lb/week — 61% Calories/day' },
  ];

  const formatCal = (n) => new Intl.NumberFormat().format(Math.round(n));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const age = Number(form.age);
      const height = Number(form.height);
      const weight = Number(form.weight);
      if (!age || !height || !weight) throw new Error('Please provide valid age, height and weight');

      // Mifflin-St Jeor BMR
      let bmr = 10 * weight + 6.25 * height - 5 * age + (form.gender === 'male' ? 5 : -161);
      const activityMul = activityMultipliers[form.activity] || 1.55;
      const tdee = bmr * activityMul;

      const results = categories.map((c) => ({
        ...c,
        calories: Math.max(1200, Math.round(tdee * c.pct)),
        pctLabel: Math.round(c.pct * 100),
      }));

      setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), rows: results });
    } catch (err) {
      setError(err.message || 'Calculation failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2>Calorie Calculator</h2>
        <p className="text-muted mb-0">Estimate daily calorie needs and see targets for weight change</p>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-md-5">
          <div className="card p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Age (years)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  min="10"
                  max="120"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  min="80"
                  max="250"
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

              <div className="mb-3">
                <label className="form-label">Activity level</label>
                <select
                  className="form-select"
                  value={form.activity}
                  onChange={(e) => setForm({ ...form, activity: e.target.value })}
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very">Very active (hard exercise & physical job)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Calories'}
              </button>
            </form>
          </div>
        </div>

        {result && (
          <div className="col-md-5">
            <div className="card p-4">
              <h5 className="mb-3 text-center">Results</h5>
              <p className="text-center mb-2">BMR: <strong>{result.bmr} kcal</strong> | TDEE: <strong>{result.tdee} kcal</strong></p>

              <div className="list-group">
                {result.rows.map((r) => (
                  <div key={r.key} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{r.label}</div>
                        <small className="text-muted">{r.note}</small>
                      </div>
                      <div className="text-end">
                        <div className="h5 mb-0">{formatCal(r.calories)}</div>
                        <small className="text-muted">{r.pctLabel}%</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
