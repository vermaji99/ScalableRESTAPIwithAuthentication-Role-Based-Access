import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token, logout, user } = useAuth();
  return (
    <>
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      {token && (
        <nav className="glass-nav">
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          </div>
          <div className="nav-links">
            <span style={{ fontSize: '14px', opacity: 0.7 }}>{user?.email}</span>
            <button onClick={logout} className="glass-button" style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </nav>
      )}

      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
