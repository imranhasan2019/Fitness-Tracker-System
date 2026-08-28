import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Memberships = () => {
  const { refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    API.get('/memberships')
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planId) => {
    setMessage('');
    setError('');
    setSubscribing(planId);
    try {
      const res = await API.post(`/memberships/${planId}/subscribe`);
      setMessage(res.data.message);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(null);
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
      <div className="page-header">
        <h2>Membership Plans</h2>
        <p className="text-muted mb-0">Choose a plan that fits your fitness goals</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {plans.map((plan, index) => (
          <div className="col-md-4" key={plan._id}>
            <div className={`card plan-card p-4 ${index === 1 ? 'featured' : ''}`}>
              {index === 1 && (
                <span className="badge bg-primary mb-2 align-self-start">Popular</span>
              )}
              <h4>{plan.name}</h4>
              <h2 className="text-primary">
                ৳{plan.price}
                <small className="text-muted fs-6">/ {plan.durationDays} days</small>
              </h2>
              <p className="text-muted">{plan.description}</p>
              <ul className="list-unstyled">
                {plan.features?.map((feature) => (
                  <li key={feature} className="mb-1">
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary w-100 mt-auto"
                onClick={() => handleSubscribe(plan._id)}
                disabled={subscribing === plan._id}
              >
                {subscribing === plan._id ? 'Subscribing...' : 'Choose Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memberships;
