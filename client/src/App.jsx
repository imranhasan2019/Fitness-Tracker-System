import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Memberships from './pages/Memberships';
import Workouts from './pages/Workouts';
import BMICalculator from './pages/BMICalculator';
import CalorieCalculator from './pages/CalorieCalculator';
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberManagement from './pages/admin/MemberManagement';
import PlanManagement from './pages/admin/PlanManagement';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/memberships"
          element={
            <PrivateRoute>
              <Memberships />
            </PrivateRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />
        <Route
          path="/bmi"
          element={
            <PrivateRoute>
              <BMICalculator />
            </PrivateRoute>
          }
        />

        <Route
          path="/calories"
          element={
            <PrivateRoute>
              <CalorieCalculator />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminRoute>
              <MemberManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <AdminRoute>
              <PlanManagement />
            </AdminRoute>
          }
        />
      </Routes>
      <footer className="text-center">
        <div className="container">
          <p className="mb-0">
            Gym Membership & Fitness Tracker System &copy; {new Date().getFullYear()} | CSE-323
            Web Programming | Developed by: <a>Imran Hosen</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
