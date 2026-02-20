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
  const [members, setMembers] = useState('');
  const [milestones, setMilestones] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const projects = getProjects();
    const newProject = {
      id: Date.now(),
      name,
      members: members.split(',').map(m => m.trim()).filter(Boolean),
      milestones: milestones.split(',').map(m => m.trim()).filter(Boolean),
    };
    setProjects([...projects, newProject]);
    setName(''); setMembers(''); setMilestones('');
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h4>Create Project</h4>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" required />
      <input value={members} onChange={e => setMembers(e.target.value)} placeholder="Members (comma separated)" />
      <input value={milestones} onChange={e => setMilestones(e.target.value)} placeholder="Milestones (comma separated)" />
      <button type="submit">Create</button>
    </form>
  );
};

export default ProjectForm;
