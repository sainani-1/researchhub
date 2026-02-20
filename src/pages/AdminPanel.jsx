import React, { useState, useEffect } from 'react';
import ProjectForm from '../components/ProjectForm';
import DocumentUpload from '../components/DocumentUpload';

function getProjects() {
  const raw = localStorage.getItem('projects');
  return raw ? JSON.parse(raw) : [];
}
function setProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}
function getDocs() {
  const raw = localStorage.getItem('documents');
  return raw ? JSON.parse(raw) : [];
}
function setDocs(docs) {
  localStorage.setItem('documents', JSON.stringify(docs));
}
function getChats() {
  const raw = localStorage.getItem('chat');
  return raw ? JSON.parse(raw) : [];
}
function setChats(chats) {
  localStorage.setItem('chat', JSON.stringify(chats));
}

const AdminPanel = () => {
  const [projects, setProjectsState] = useState(getProjects());
  const [docs, setDocsState] = useState(getDocs());
  const [previewDoc, setPreviewDoc] = useState(null);
  const [chats, setChatsState] = useState(getChats());
  const [selectedTab, setSelectedTab] = useState('projects');
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectsState(getProjects());
      setDocsState(getDocs());
      setChatsState(getChats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Project delete
  function handleDeleteProject(id) {
    if (window.confirm('Delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      setProjectsState(updated);
    }
  }
  // Document delete
  function handleDeleteDoc(id) {
    if (window.confirm('Delete this document?')) {
      const updated = docs.filter(d => d.id !== id);
      setDocs(updated);
      setDocsState(updated);
    }
  }
  function handleToggleApproveDoc(id) {
    const updated = docs.map(d => d.id === id ? { ...d, approved: !d.approved } : d);
    setDocs(updated);
    setDocsState(updated);
  }
  // Chat delete
  function handleDeleteChat(id) {
    if (window.confirm('Delete this message?')) {
      const updated = chats.filter(m => m.id !== id);
      setChats(updated);
      setChatsState(updated);
    }
  }

  function handlePreview(doc) {
    setPreviewDoc(doc);
  }
  function handleClosePreview() {
    setPreviewDoc(null);
  }

  return (
    <div className="admin-panel" style={{maxWidth:700,margin:'0 auto',padding:'2em 1em'}}>
      <h2 style={{marginBottom:'1.2em',fontWeight:700,letterSpacing:1}}>Admin Panel</h2>
      <div style={{display:'flex',gap:16,marginBottom:24}}>
        {['projects','documents','chat','create'].map(tab => (
          <button
            key={tab}
            onClick={()=>setSelectedTab(tab)}
            className={selectedTab===tab?'active':''}
            style={{
              background:selectedTab===tab?'#4299e1':'#f5f5f5',
              color:selectedTab===tab?'#fff':'#222',
              border:'none',borderRadius:6,padding:'0.5em 1.5em',fontWeight:500,cursor:'pointer',boxShadow:selectedTab===tab?'0 2px 8px #4299e133':'none',transition:'all 0.2s'
            }}
          >
            {tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{background:'#fff',borderRadius:10,boxShadow:'0 2px 12px #0001',padding:'2em 1.5em',marginBottom:24}}>
        {selectedTab==='projects' && (
          <div>
            <h4 style={{marginBottom:16}}>All Projects</h4>
            <ul style={{listStyle:'none',padding:0}}>
              {projects.map(p => (
                <li key={p.id} style={{marginBottom:14,padding:'0.7em 0.5em',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span>
                    <b>{p.name}</b> <span style={{color:'#888',fontSize:'0.97em'}}>({p.members.join(', ')})</span>
                  </span>
                  <button onClick={()=>handleDeleteProject(p.id)} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'0.3em 1em',marginLeft:12,cursor:'pointer'}}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedTab==='documents' && (
          <div>
            <h4 style={{marginBottom:16}}>All Documents</h4>
            <ul style={{listStyle:'none',padding:0}}>
              {docs.map(d => (
                <li key={d.id} style={{marginBottom:14,padding:'0.7em 0.5em',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span>
                    {d.name} <span style={{color:'#888',fontSize:'0.97em'}}>by {d.uploader}</span>
                    {typeof d.approved !== 'undefined' && (
                      <span style={{color:d.approved?'#38a169':'#ed8936',marginLeft:8}}>
                        [{d.approved?'Approved':'Pending'}]
                      </span>
                    )}
                  </span>
                  <span>
                    <button onClick={()=>handlePreview(d)} style={{background:'#4299e1',color:'#fff',border:'none',borderRadius:6,padding:'0.3em 1em',marginLeft:8,cursor:'pointer'}}>View Doc</button>
                    <button onClick={()=>handleDeleteDoc(d.id)} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'0.3em 1em',marginLeft:12,cursor:'pointer'}}>Delete</button>
                    {typeof d.approved !== 'undefined' && (
                      <button onClick={()=>handleToggleApproveDoc(d.id)} style={{background:d.approved?'#ed8936':'#38a169',color:'#fff',border:'none',borderRadius:6,padding:'0.3em 1em',marginLeft:8,cursor:'pointer'}}>
                        {d.approved ? 'Unapprove' : 'Approve'}
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {previewDoc && (
              <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
                <div className="modal" style={{background:'#fff',padding:'2em',borderRadius:10,maxWidth:600,maxHeight:600,overflow:'auto',position:'relative'}}>
                  <button onClick={handleClosePreview} style={{position:'absolute',top:10,right:10,fontSize:'2em',background:'none',border:'none',cursor:'pointer',color:'#ff2222',fontWeight:'bold'}}>×</button>
                  <h4 style={{marginBottom:16}}>{previewDoc.name}</h4>
                  {previewDoc.content ? (
                    previewDoc.content.startsWith('data:image') ? (
                      <>
                        <img src={previewDoc.content} alt={previewDoc.name} style={{maxWidth:'100%',maxHeight:400}} />
                        <a href={previewDoc.content} download={previewDoc.name} style={{display:'block',marginTop:16,color:'#4299e1',fontWeight:500,textAlign:'center'}}>Download file</a>
                      </>
                    ) : previewDoc.content.startsWith('data:application/pdf') ? (
                      <>
                        <embed src={previewDoc.content} type="application/pdf" width="100%" height="400px" />
                        <a href={previewDoc.content} download={previewDoc.name} style={{display:'block',marginTop:16,color:'#4299e1',fontWeight:500,textAlign:'center'}}>Download file</a>
                      </>
                    ) : previewDoc.content.startsWith('data:text') ? (
                      <>
                        <iframe src={previewDoc.content} title={previewDoc.name} style={{width:'100%',height:'400px',border:'1px solid #ccc'}} />
                        <a href={previewDoc.content} download={previewDoc.name} style={{display:'block',marginTop:16,color:'#4299e1',fontWeight:500,textAlign:'center'}}>Download file</a>
                      </>
                    ) : (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <div style={{fontSize:'2em',marginBottom:12}}>
                          📄
                        </div>
                        <a href={previewDoc.content} download={previewDoc.name} style={{display:'block',marginTop:16,color:'#4299e1',fontWeight:500,textAlign:'center'}}>Download file</a>
                        <div style={{color:'#888',marginTop:8}}>No preview available for this file type.</div>
                      </div>
                    )
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                      <div style={{fontSize:'2em',marginBottom:12}}>📄</div>
                      <div style={{color:'#888'}}>No preview available. Download to view.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab==='chat' && (
          <div>
            <h4 style={{marginBottom:16}}>Project Chats</h4>
            <div style={{marginBottom:12}}>
              <label style={{fontWeight:500}}>Filter by project: </label>
              <select value={selectedProjectId} onChange={e=>setSelectedProjectId(e.target.value)} style={{marginLeft:8,padding:'0.3em 1em',borderRadius:6,border:'1px solid #ccc'}}>
                <option value="all">All</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div style={{maxHeight:220,overflowY:'auto',background:'#f5f5f5',padding:12,marginBottom:8,borderRadius:8}}>
              {chats
                .filter(m => selectedProjectId==='all' || String(m.projectId)===String(selectedProjectId))
                .map(m => (
                  <div key={m.id} style={{marginBottom:10,padding:'0.5em 0.7em',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span>
                      <b>{m.sender}:</b> {m.text}
                      {m.projectId && (
                        <span style={{marginLeft:8,color:'#888',fontSize:'0.95em'}}>({projects.find(p=>String(p.id)===String(m.projectId))?.name||'Unknown'})</span>
                      )}
                    </span>
                    <button onClick={()=>handleDeleteChat(m.id)} style={{background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'0.3em 1em',marginLeft:12,cursor:'pointer'}}>Delete</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedTab==='create' && (
          <div>
            <ProjectForm />
            <DocumentUpload />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
