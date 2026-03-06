import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, api } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.data);
      const redirect = location.state?.from?.pathname || "/dashboard";
      navigate(redirect, { replace: true });
    } catch (e) {
      setError(e.response?.data?.error?.code || "Login failed");
    }
  };

  return (
    <div className="flex-center">
      <div className="glass-card">
        <h2 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '32px' }}>Login to manage your tasks</p>
        
        {error && (
          <div style={{ background: 'rgba(255, 82, 82, 0.1)', color: '#ff5252', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(255, 82, 82, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ position: 'relative' }}>
            <input 
              className="glass-input" 
              placeholder="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              className="glass-input" 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="glass-button">Sign In</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', opacity: 0.7 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
