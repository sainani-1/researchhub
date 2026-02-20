import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const DEFAULT_MESSAGES = [
  { id: 1, sender: 'alice', text: 'Welcome to the project!' },
  { id: 2, sender: 'bob', text: 'Let’s start with the proposal.' },
];

function getMessages() {
  const raw = localStorage.getItem('chat');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('chat', JSON.stringify(DEFAULT_MESSAGES));
  return DEFAULT_MESSAGES;
}
function setMessagesLS(msgs) {
  localStorage.setItem('chat', JSON.stringify(msgs));
}

const ChatBoard = () => {
  const [messages, setMessages] = useState(getMessages());
  const [input, setInput] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(getMessages());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMsg = { id: Date.now(), sender: user || 'me', text: input };
      setMessagesLS([...getMessages(), newMsg]);
      setInput('');
    }
  };

  return (
    <div className="chat-board">
      <h3>Project Chat</h3>
      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id}><b>{m.sender}:</b> {m.text}</div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBoard;
