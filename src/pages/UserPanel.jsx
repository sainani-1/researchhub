import React from 'react';
import DocumentUpload from '../components/DocumentUpload';

const UserPanel = () => {
  return (
    <div className="user-panel">
      <h2>User Panel</h2>
      <DocumentUpload />
      {/* Could add user-specific features here */}
    </div>
  );
};

export default UserPanel;
