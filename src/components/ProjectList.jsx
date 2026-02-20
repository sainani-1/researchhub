import React, { useEffect, useState } from 'react';
import ProjectDetails from './ProjectDetails';

const DEFAULT_PROJECTS = [
  { id: 1, name: 'AI Research', members: ['alice', 'bob'], milestones: ['Proposal', 'Experiment', 'Paper'], status: 'Ongoing' },
  { id: 2, name: 'Quantum Computing', members: ['carol'], milestones: ['Literature Review', 'Simulation'], status: 'Pending' },
];

function getProjects() {
  const raw = localStorage.getItem('projects');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('projects', JSON.stringify(DEFAULT_PROJECTS));
  return DEFAULT_PROJECTS;
}

const statusColors = {
  Ongoing: '#4299e1',
  Completed: '#38a169',
  Pending: '#ed8936',
};


const ProjectList = () => {
  const [projects, setProjects] = useState(getProjects());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(getProjects());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="project-list">
      <h3 style={{marginBottom:'1.5em'}}>Projects</h3>
      <div style={{display:'flex',flexWrap:'wrap',gap:'1.5em'}}>
        {projects.map(p => (
          <div key={p.id} className="card" style={{minWidth:280,maxWidth:340,flex:'1 1 320px',position:'relative',cursor:'pointer'}} onClick={() => setSelected(p)}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <strong style={{fontSize:'1.15em'}}>{p.name}</strong>
              <span style={{background:statusColors[p.status]||'#888',color:'#fff',borderRadius:8,padding:'0.2em 0.8em',fontSize:'0.95em'}}>{p.status||'Ongoing'}</span>
            </div>
            <div style={{margin:'0.7em 0 0.2em 0',fontSize:'0.97em',color:'#666'}}>Members: {p.members.join(', ')}</div>
            <div style={{margin:'0.5em 0 0.2em 0',fontWeight:500}}>Milestones:</div>
            <ul style={{margin:0,paddingLeft:'1.2em'}}>
              {p.milestones.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {selected && <ProjectDetails project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default ProjectList;
