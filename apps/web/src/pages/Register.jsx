import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { api } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", { email, password, name });
      setSuccess("Registered successfully. Please login.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (e) {
      setError(e.response?.data?.error?.code || "Registration failed");
    }
  };

  return (
    <div className="flex-center">
      <div className="glass-card">
        <h2 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Join Us</h2>
        <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '32px' }}>Create an account to get started</p>
        
        {error && (
          <div style={{ background: 'rgba(255, 82, 82, 0.1)', color: '#ff5252', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(255, 82, 82, 0.2)' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(105, 240, 174, 0.1)', color: '#69f0ae', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(105, 240, 174, 0.2)' }}>
            {success}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input 
            className="glass-input" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            className="glass-input" 
            placeholder="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="glass-input" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="glass-button">Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', opacity: 0.7 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
