import React, { useState } from 'react';

function getProjects() {
  const raw = localStorage.getItem('projects');
  return raw ? JSON.parse(raw) : [];
}

function setProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

const ProjectForm = () => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState('');

  // Get all users from localStorage and demo users
  const demoUsers = [
    { username: 'admin' },
    { username: 'user' }
  ];
  const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const allUsers = [...demoUsers, ...localUsers].map(u => u.username);

  const handleMemberChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setMembers([...members, value]);
    } else {
      setMembers(members.filter(m => m !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projects = getProjects();
    const newProject = {
      id: Date.now(),
      name,
      members,
      milestones: milestones.split(',').map(m => m.trim()).filter(Boolean),
    };
    setProjects([...projects, newProject]);
    setName(''); setMembers([]); setMilestones('');
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h4>Create Project</h4>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" required />
      <div style={{marginBottom:'1em'}}>
        <div style={{marginBottom:'0.5em'}}>Select Members:</div>
        {allUsers.map(u => (
          <label key={u} style={{marginRight:'1em'}}>
            <input
              type="checkbox"
              value={u}
              checked={members.includes(u)}
              onChange={handleMemberChange}
            />
            {u}
          </label>
        ))}
      </div>
      <input value={milestones} onChange={e => setMilestones(e.target.value)} placeholder="Milestones (comma separated)" />
      <button type="submit">Create</button>
    </form>
  );
};

export default ProjectForm;
