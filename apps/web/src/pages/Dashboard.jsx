import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { api, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "admin";

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data || []);
    } catch (e) {
      setMessage("Failed to load tasks");
    }
  };

  const loadUsers = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (e) {
      setMessage("Failed to load users");
    }
  };

  useEffect(() => {
    loadTasks();
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const create = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      await loadTasks();
      setMessage("Task created");
    } catch (e) {
      setMessage("Create failed");
    }
  };

  const removeTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
    } catch {
      setMessage("Delete failed");
    }
  };

  const removeUser = async (id) => {
    if (!isAdmin) return;
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
      await loadTasks(); // Refresh tasks since some might be deleted with cascade
    } catch {
      setMessage("User delete failed");
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>{isAdmin ? "Admin Console" : "My Tasks"}</h2>
          <p style={{ opacity: 0.6 }}>Manage your system and tasks effectively</p>
        </div>
        <div className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
          {user?.role}
        </div>
      </div>
      
      {message && (
        <div style={{ background: 'rgba(105, 240, 174, 0.1)', color: '#69f0ae', padding: '12px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(105, 240, 174, 0.2)' }}>
          {message}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Task Creation Section */}
        <section className="glass-card" style={{ maxWidth: 'none', height: 'fit-content' }}>
          <h3 className="section-title">
            <span style={{ fontSize: '20px' }}>📝</span> Add New Task
          </h3>
          <form onSubmit={create}>
            <input 
              className="glass-input" 
              placeholder="What needs to be done?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              className="glass-input" 
              placeholder="Add some details..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ minHeight: "100px", resize: 'vertical' }}
            />
            <button type="submit" className="glass-button">Create Task</button>
          </form>
        </section>

        {/* Tasks List Section */}
        <section>
          <h3 className="section-title">
            <span style={{ fontSize: '20px' }}>🚀</span> {isAdmin ? "System Tasks" : "Your Progress"}
          </h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
            {tasks.map((t) => (
              <div key={t._id} className="task-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '6px', color: 'var(--primary)' }}>{t.title}</h4>
                    <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.5' }}>{t.description || "No description provided."}</p>
                    {isAdmin && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <span style={{ fontSize: '11px', opacity: 0.4 }}>Owner: {t.userId}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeTask(t._id)} className="delete-btn" title="Remove Task">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', opacity: 0.4 }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                <p>No tasks found yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Admin Users Section */}
        {isAdmin && (
          <section className="glass-card" style={{ maxWidth: 'none', gridColumn: '1 / -1' }}>
            <h3 className="section-title">
              <span style={{ fontSize: '20px' }}>👥</span> System Users
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {users.map((u) => (
                <div key={u._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{u.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.5 }}>{u.email}</div>
                    <div className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ marginTop: '8px', fontSize: '10px' }}>{u.role}</div>
                  </div>
                  {u._id !== user?.id && (
                    <button onClick={() => removeUser(u._id)} className="delete-btn" style={{ fontSize: '16px' }}>
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
