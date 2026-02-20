import React, { useState } from 'react';
import { useAuth } from '../authUtils';

function getDocs() {
  const raw = localStorage.getItem('documents');
  return raw ? JSON.parse(raw) : [];
}
function setDocs(docs) {
  localStorage.setItem('documents', JSON.stringify(docs));
}

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState('');
  const { user } = useAuth();

  // Get projects for dropdown
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file && projectId) {
      const docs = getDocs();
      // Read file as base64
      const reader = new FileReader();
      reader.onload = function(ev) {
        const base64 = ev.target.result;
        const newDoc = { id: Date.now(), name: file.name, uploader: user, content: base64, projectId };
        setDocs([...docs, newDoc]);
        setFile(null);
        setProjectId('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="document-upload" onSubmit={handleUpload}>
      <h4>Upload Document</h4>
      <select value={projectId} onChange={e => setProjectId(e.target.value)} required style={{marginBottom:'1em'}}>
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" disabled={!file || !projectId}>Upload</button>
    </form>
  );
};

export default DocumentUpload;
