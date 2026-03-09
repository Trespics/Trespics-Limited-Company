import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, MessageSquare, Quote, LogOut, Menu, X } from 'lucide-react';
import ProjectManager from '../components/ProjectManager';
import TestimonialManager from '../components/TestimonialManager';
import MessageList from '../components/MessageList';
import './Dashboard.css'; // Add this import

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials' | 'messages'>('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-header">
          {isSidebarOpen && <h2 className="sidebar-title">Trespics Admin</h2>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="sidebar-toggle"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="nav-icon" size={20} />
              {isSidebarOpen && <span className="nav-label">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <LogOut className="logout-icon" size={20} />
            {isSidebarOpen && <span className="logout-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <LayoutDashboard className="header-icon" size={24} />
            <h1 className="header-title">{activeTab} Management</h1>
          </div>
          <div className="header-right">
            <span className="welcome-text">Welcome, Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'testimonials' && <TestimonialManager />}
          {activeTab === 'messages' && <MessageList />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;