import React, { useState, useEffect } from 'react';
import { useAuth } from '../authUtils';

// Utility to get/set project-specific data in localStorage
function getProjectDocs(projectId) {
  const all = JSON.parse(localStorage.getItem('documents') || '[]');
  return all.filter(d => d.projectId === projectId);
}
function setProjectDocs(projectId, docs) {
  const all = JSON.parse(localStorage.getItem('documents') || '[]');
  const filtered = all.filter(d => d.projectId !== projectId);
  localStorage.setItem('documents', JSON.stringify([...filtered, ...docs]));
}
function getProjectChat(projectId) {
  const all = JSON.parse(localStorage.getItem('chat') || '[]');
  return all.filter(m => m.projectId === projectId);
}
function setProjectChat(projectId, msgs) {
  const all = JSON.parse(localStorage.getItem('chat') || '[]');
  const filtered = all.filter(m => m.projectId !== projectId);
  localStorage.setItem('chat', JSON.stringify([...filtered, ...msgs]));
}
function getProjectMilestones(projectId) {
  const all = JSON.parse(localStorage.getItem('milestones') || '[]');
  return all.find(m => m.projectId === projectId)?.milestones || [];
}
function setProjectMilestones(projectId, milestones) {
  const all = JSON.parse(localStorage.getItem('milestones') || '[]');
  const filtered = all.filter(m => m.projectId !== projectId);
  localStorage.setItem('milestones', JSON.stringify([...filtered, { projectId, milestones }]));
}

const ProjectDetails = ({ project, onClose }) => {
  const { user, role } = useAuth();
  const [tab, setTab] = useState('docs');
  const [docs, setDocs] = useState([]);
  const [chat, setChat] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [msg, setMsg] = useState('');
  const [docName, setDocName] = useState('');
  const [docFile, setDocFile] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setDocs(getProjectDocs(project.id));
      setChat(getProjectChat(project.id));
      setMilestones(getProjectMilestones(project.id));
    }, 0);
    const interval = setInterval(() => {
      setDocs(getProjectDocs(project.id));
      setChat(getProjectChat(project.id));
      setMilestones(getProjectMilestones(project.id));
    }, 1000);
    return () => clearInterval(interval);
  }, [project.id]);

    // Document upload
    function handleDocUpload(e) {
      e.preventDefault();
      if (docName && docFile) {
        const newDoc = { id: Date.now(), name: docName, uploader: user, projectId: project.id, approved: role === 'admin' };
        setProjectDocs(project.id, [...docs, newDoc]);
        setDocName(''); setDocFile(null);
      }
    }
    // Document approval
    function approveDoc(docId) {
      setProjectDocs(project.id, docs.map(d => d.id === docId ? { ...d, approved: true } : d));
    }
    // Chat send
    function handleSendMsg(e) {
      e.preventDefault();
      if (msg.trim()) {
        const newMsg = { id: Date.now(), sender: user, text: msg, projectId: project.id };
        setProjectChat(project.id, [...chat, newMsg]);
        setMsg('');
      }
    }
    // Milestone toggle
    function toggleMilestone(idx) {
      setProjectMilestones(project.id, milestones.map((m, i) => i === idx ? { ...m, done: !m.done } : m));
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>{project.name} Details</h2>
          <div className="tabs">
            <button onClick={() => setTab('docs')} className={tab==='docs'?'active':''}>Documents</button>
            <button onClick={() => setTab('chat')} className={tab==='chat'?'active':''}>Chat</button>
            <button onClick={() => setTab('milestones')} className={tab==='milestones'?'active':''}>Milestones</button>
            <button onClick={() => setTab('members')} className={tab==='members'?'active':''}>Members</button>
          </div>
          {tab==='docs' && (
            <div>
              <h4>Documents</h4>
              <ul>
                {docs.map(d => (
                  <li key={d.id}>
                    {d.name} (by {d.uploader})
                    {d.approved ? <span style={{color:'green',marginLeft:8}}>[Approved]</span> : <span style={{color:'orange',marginLeft:8}}>[Pending]</span>}
                    {d.approved && (
                      <a
                        href={d.content || d.url || '#'}
                        download={d.name}
                        style={{marginLeft:8,padding:'0.3em 1em',borderRadius:6,background:'#38a169',color:'#fff',border:'none',textDecoration:'none',cursor:'pointer',display:'inline-block'}}
                      >Download</a>
                    )}
                    {role==='admin' && !d.approved && (
                      <button style={{marginLeft:8}} onClick={()=>approveDoc(d.id)}>Approve</button>
                    )}
                  </li>
                ))}
              </ul>
              {project.members.includes(user) ? (
                <form onSubmit={handleDocUpload} style={{marginTop:12}}>
                  <input value={docName} onChange={e=>setDocName(e.target.value)} placeholder="Document name" required />
                  <input type="file" onChange={e=>setDocFile(e.target.files[0])} required />
                  <button type="submit">Upload</button>
                </form>
              ) : (
                <div style={{marginTop:12, color:'#888'}}>Only project members can upload documents.</div>
              )}
            </div>
          )}
          {tab==='chat' && (
            <div>
              <h4>Project Chat</h4>
              <div style={{maxHeight:180,overflowY:'auto',background:'#f5f5f5',padding:8,marginBottom:8}}>
                {chat.map(m => <div key={m.id}><b>{m.sender}:</b> {m.text}</div>)}
              </div>
              {project.members.includes(user) ? (
                <form onSubmit={handleSendMsg}>
                  <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message..." />
                  <button type="submit">Send</button>
                </form>
              ) : (
                <div style={{marginTop:12, color:'#888'}}>Only project members can send messages.</div>
              )}
            </div>
          )}
          {tab==='milestones' && (
            <div>
              <h4>Milestones</h4>
              <ul>
                {milestones.map((ms, i) => (
                  <li key={ms.name}>
                    <label>
                      <input type="checkbox" checked={!!ms.done} onChange={()=>toggleMilestone(i)} disabled={!project.members.includes(user)} />
                      {ms.name}
                    </label>
                  </li>
                ))}
              </ul>
              {!project.members.includes(user) && (
                <div style={{marginTop:12, color:'#888'}}>Only project members can update milestones.</div>
              )}
            </div>
          )}
          {tab==='members' && (
            <ProjectMembersTab project={project} user={user} />
          )}
        </div>
      </div>
    );
  }

  // ProjectMembersTab must be outside the main component for hooks
  function ProjectMembersTab({ project, user }) {
    const [projects, setProjects] = React.useState(() => JSON.parse(localStorage.getItem('projects')||'[]'));
    const [isMember, setIsMember] = React.useState(project.members.includes(user));
    const [members, setMembers] = React.useState(project.members);

    React.useEffect(() => {
      const updated = JSON.parse(localStorage.getItem('projects')||'[]').find(p=>p.id===project.id)?.members || [];
      setMembers(updated);
      setIsMember(updated.includes(user));
    }, [project, user]);

    function updateMembership(join) {
      const updatedProjects = projects.map(p =>
        p.id === project.id
          ? { ...p, members: join
              ? Array.from(new Set([...p.members, user]))
              : p.members.filter(m => m !== user) }
          : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      const updated = updatedProjects.find(p=>p.id===project.id)?.members || [];
      setMembers(updated);
      setIsMember(updated.includes(user));
    }

    return (
      <div>
        <h4>Members</h4>
        <ul>
          {members.map(m => <li key={m}>{m}</li>)}
        </ul>
        <div style={{marginTop:12}}>
          {isMember
            ? <button onClick={()=>updateMembership(false)} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1.2em'}}>Leave Project</button>
            : <button onClick={()=>updateMembership(true)} style={{background:'#38a169',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1.2em'}}>Join Project</button>
          }
        </div>
      </div>
  );
}



export default ProjectDetails;
