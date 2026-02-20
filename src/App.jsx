import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from './authUtils';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';

import AdminPanel from './pages/AdminPanel';
import UserPanel from './pages/UserPanel';
import Login from './pages/Login';


function PrivateRoute({ children, role: requiredRole }) {
  const { role, loading } = useAuth();
  if (loading) return <div style={{padding:'2em',textAlign:'center'}}>Loading...</div>;
  if (!role) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div style={{padding:'2em 0 0 0',maxWidth:1200,margin:'0 auto'}}>
                  <h2 style={{marginBottom:'0.5em'}}>Dashboard</h2>
                  <DashboardSummary />
                  <ProjectList />
                </div>
              </PrivateRoute>
            }
          />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute role="user"><UserPanel /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

  function DashboardSummary() {
    // Dashboard summary: project stats, user info, etc.
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const total = projects.length;
    const ongoing = projects.filter(p => p.status === 'Ongoing').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const pending = projects.filter(p => p.status === 'Pending').length;
    return (
      <div style={{display:'flex',gap:'2em',marginBottom:'2em',flexWrap:'wrap'}}>
        <div className="summary-card" style={{background:'#222',color:'#fff',borderRadius:12,padding:'1.2em 2em',minWidth:180,boxShadow:'0 2px 8px #0002'}}>
          <div style={{fontSize:'2em',fontWeight:700}}>{total}</div>
          <div style={{fontSize:'1em',opacity:0.8}}>Total Projects</div>
        </div>
        <div className="summary-card" style={{background:'#4299e1',color:'#fff',borderRadius:12,padding:'1.2em 2em',minWidth:180,boxShadow:'0 2px 8px #0002'}}>
          <div style={{fontSize:'2em',fontWeight:700}}>{ongoing}</div>
          <div style={{fontSize:'1em',opacity:0.8}}>Ongoing</div>
        </div>
        <div className="summary-card" style={{background:'#38a169',color:'#fff',borderRadius:12,padding:'1.2em 2em',minWidth:180,boxShadow:'0 2px 8px #0002'}}>
          <div style={{fontSize:'2em',fontWeight:700}}>{completed}</div>
          <div style={{fontSize:'1em',opacity:0.8}}>Completed</div>
        </div>
        <div className="summary-card" style={{background:'#ed8936',color:'#fff',borderRadius:12,padding:'1.2em 2em',minWidth:180,boxShadow:'0 2px 8px #0002'}}>
          <div style={{fontSize:'2em',fontWeight:700}}>{pending}</div>
          <div style={{fontSize:'1em',opacity:0.8}}>Pending</div>
        </div>
      </div>
    );
  }
export default App;
