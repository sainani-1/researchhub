import React, { useEffect, useState } from 'react';

const DEFAULT_DOCS = [
  { id: 1, name: 'AI_Proposal.pdf', uploader: 'alice' },
  { id: 2, name: 'Quantum_Sim.docx', uploader: 'carol' },
];

function getDocs() {
  const raw = localStorage.getItem('documents');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('documents', JSON.stringify(DEFAULT_DOCS));
  return DEFAULT_DOCS;
}

const DocumentList = () => {
  const [docs, setDocs] = useState(getDocs());
  // Removed unused handleDownloadTest to fix lint error

  useEffect(() => {
    const interval = setInterval(() => {
      setDocs(getDocs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [previewDoc, setPreviewDoc] = useState(null);

  function handlePreview(doc) {
    setPreviewDoc(doc);
  }

  function handleClosePreview() {
    setPreviewDoc(null);
  }

  return (
    <div className="document-list">
      <h3>Documents</h3>
      <ul>
        {docs.map(d => (
          <li key={d.id} style={{marginBottom:8}}>
            <span>{d.name}</span> (by {d.uploader})
            <button style={{marginLeft:12,padding:'0.3em 1em',borderRadius:6,background:'#4299e1',color:'#fff',border:'none',cursor:'pointer'}} onClick={() => handlePreview(d)}>View Doc</button>
            <a
              href={d.content || d.url || '#'}
              download={d.name}
              style={{marginLeft:8,padding:'0.3em 1em',borderRadius:6,background:'#38a169',color:'#fff',border:'none',textDecoration:'none',cursor:'pointer',display:'inline-block'}}
            >Download</a>
          </li>
        ))}
      </ul>
      {previewDoc && (
        <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div className="modal" style={{background:'#fffbe6',padding:'2em',borderRadius:10,maxWidth:600,maxHeight:600,overflow:'auto',position:'relative',border:'5px solid #e53e3e',boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
            <div style={{background:'#3182ce',color:'#fff',padding:'0.5em',borderRadius:'6px',marginBottom:'1em',textAlign:'center',fontWeight:'bold',fontSize:'1.2em'}}>TEST BUTTON AREA (TOP)</div>
            <button style={{display:'block',margin:'0 auto 1em auto',padding:'1em',background:'#e53e3e',color:'#fff',borderRadius:'10px',fontWeight:'bold',fontSize:'1.2em',border:'2px solid #c53030',boxShadow:'0 4px 16px rgba(0,0,0,0.12)'}}>Test Button (TOP)</button>
            <button onClick={handleClosePreview} style={{position:'absolute',top:10,right:10,fontSize:'2em',background:'none',border:'none',cursor:'pointer',color:'#ff2222',fontWeight:'bold'}}>×</button>
            <h4 style={{marginBottom:16}}>{previewDoc.name}</h4>
            {/* Always show download button below name, outside preview logic */}
            <div style={{width:'100%',display:'flex',justifyContent:'center',marginBottom:24,border:'2px dashed #e53e3e',background:'#fffbe6',padding:'1em'}}>
              <span style={{color:'#e53e3e',fontWeight:'bold',marginRight:12}}>Download Button Area:</span>
              {previewDoc?.content || previewDoc?.url ? (
                <a
                  href={previewDoc?.content || previewDoc?.url}
                  download={previewDoc?.name || ''}
                  style={{
                    display:'block',
                    width:'80%',
                    padding:'1em',
                    background:'#3182ce',
                    color:'#fff',
                    borderRadius:'10px',
                    fontWeight:'bold',
                    fontSize:'1.2em',
                    textDecoration:'none',
                    textAlign:'center',
                    border:'2px solid #2b6cb0',
                    margin:'0 auto',
                    boxShadow:'0 4px 16px rgba(0,0,0,0.12)'
                  }}
                >Download File</a>
              ) : (
                <button
                  disabled
                  style={{
                    display:'block',
                    width:'80%',
                    padding:'1em',
                    background:'#ccc',
                    color:'#fff',
                    borderRadius:'10px',
                    fontWeight:'bold',
                    fontSize:'1.2em',
                    textAlign:'center',
                    border:'2px solid #aaa',
                    margin:'0 auto',
                    boxShadow:'0 4px 16px rgba(0,0,0,0.12)'
                  }}
                >Download File</button>
              )}
            </div>
            {/* Preview logic */}
            {previewDoc.content ? (
              previewDoc.content.startsWith('data:image') ? (
                <img src={previewDoc.content} alt={previewDoc.name} style={{maxWidth:'100%',maxHeight:400}} />
              ) : previewDoc.content.startsWith('data:application/pdf') ? (
                <embed src={previewDoc.content} type="application/pdf" width="100%" height="400px" />
              ) : previewDoc.content.startsWith('data:text') ? (
                <iframe src={previewDoc.content} title={previewDoc.name} style={{width:'100%',height:'400px',border:'1px solid #ccc'}} />
              ) : (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{fontSize:'2em',marginBottom:12}}>
                    📄
                  </div>
                  <div style={{color:'#888',marginTop:8}}>No preview available for this file type.</div>
                </div>
              )
            ) : previewDoc.url ? (
              <iframe src={previewDoc.url} title={previewDoc.name} style={{width:'100%',height:'400px',border:'1px solid #ccc'}} />
            ) : (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{fontSize:'2em',marginBottom:12}}>📄</div>
                <div style={{color:'#888',marginTop:8}}>No preview available. Download to view.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
