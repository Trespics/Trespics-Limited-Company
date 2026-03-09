import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Calendar, User, MessageCircle, Loader2, Inbox } from 'lucide-react';
import './MessageList.css'; // Add this import

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="message-list-container">
      {/* List Section */}
      <div className="inbox-section">
        <div className="inbox-header">
          <h2 className="inbox-title">
            <Inbox size={18} />
            Inbox
          </h2>
          <span className="message-count">{messages.length}</span>
        </div>
        
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Mail size={30} />
              </div>
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`message-item ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
              >
                <div className="message-header">
                  <span className="message-name">{msg.name}</span>
                  <span className="message-date">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="message-subject">
                  {msg.subject || '(No Subject)'}
                </div>
                <div className="message-preview">
                  {msg.message}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Section */}
      <div className="detail-section">
        {selectedMessage ? (
          <>
            <div className="message-detail-header">
              <h3 className="message-detail-title">
                {selectedMessage.subject || '(No Subject)'}
              </h3>
              <div className="message-meta">
                <div className="meta-item">
                  <User size={16} className="meta-icon" />
                  <span>{selectedMessage.name}</span>
                </div>
                <div className="meta-item">
                  <Mail size={16} className="meta-icon" />
                  <a 
                    href={`mailto:${selectedMessage.email}`} 
                    className="meta-email"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="meta-item">
                  <Calendar size={16} className="meta-icon" />
                  <span>
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="message-content">
              <div className="message-body">
                <p className="message-text">{selectedMessage.message}</p>
              </div>
            </div>
            
            <div className="message-footer">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="reply-button"
              >
                <MessageCircle size={18} />
                Reply to Message
              </a>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">
              <Mail size={60} />
            </div>
            <p className="no-selection-text">No message selected</p>
            <p className="no-selection-subtext">
              Select a message from the inbox to view its contents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;