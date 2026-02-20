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
  const { user } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const docs = getDocs();
      // Read file as base64
      const reader = new FileReader();
      reader.onload = function(ev) {
        const base64 = ev.target.result;
        const newDoc = { id: Date.now(), name: file.name, uploader: user, content: base64 };
        setDocs([...docs, newDoc]);
        setFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="document-upload" onSubmit={handleUpload}>
      <h4>Upload Document</h4>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
};

export default DocumentUpload;
