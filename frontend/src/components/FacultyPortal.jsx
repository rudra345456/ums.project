import { useState } from 'react'
import Attendance from './faculty/Attendance.jsx'
import Classes from './faculty/Classes.jsx'
import Assignments from './faculty/Assignments.jsx'
import Grading from './faculty/Grading.jsx'

export default function FacultyPortal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('attendance')

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'classes', label: 'Classes', icon: '🏫' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grading', label: 'Grading', icon: '📊' }
  ]

  const renderContent = () => {
    switch(activeTab) {
      case 'attendance': return <Attendance />
      case 'classes': return <Classes />
      case 'assignments': return <Assignments />
      case 'grading': return <Grading />
      default: return <Attendance />
    }
  }

  if (!open) return null

  return (
    <div className="faculty-portal">
      <div className="portal-header">
        <div className="portal-title">
          <h1>Faculty Portal</h1>
          <p>Welcome back, Dr. Smith</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="portal-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="portal-content">
        {renderContent()}
      </div>
    </div>
  )
}
