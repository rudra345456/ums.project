import { useState } from 'react'

export default function Classes() {
  const [selectedDay, setSelectedDay] = useState('today')
  
  const schedule = [
    {
      id: 1,
      subject: 'Computer Science 101',
      time: '09:00 AM - 10:30 AM',
      room: 'A-201',
      day: 'Monday',
      students: 45,
      status: 'upcoming'
    },
    {
      id: 2,
      subject: 'Data Structures',
      time: '11:00 AM - 12:30 PM',
      room: 'A-202',
      day: 'Monday',
      students: 38,
      status: 'ongoing'
    },
    {
      id: 3,
      subject: 'Algorithms',
      time: '02:00 PM - 03:30 PM',
      room: 'A-203',
      day: 'Monday',
      students: 42,
      status: 'completed'
    },
    {
      id: 4,
      subject: 'Database Systems',
      time: '09:00 AM - 10:30 AM',
      room: 'B-101',
      day: 'Tuesday',
      students: 40,
      status: 'upcoming'
    },
    {
      id: 5,
      subject: 'Software Engineering',
      time: '11:00 AM - 12:30 PM',
      room: 'B-102',
      day: 'Tuesday',
      students: 35,
      status: 'upcoming'
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return '#10b981'
      case 'upcoming': return '#3b82f6'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ongoing': return '🟢'
      case 'upcoming': return '⏰'
      case 'completed': return '✅'
      default: return '⏰'
    }
  }

  const filteredSchedule = selectedDay === 'today' 
    ? schedule.filter(cls => cls.day === 'Monday')
    : schedule

  return (
    <div className="classes-page">
      <div className="page-header">
        <h2>Class Schedule</h2>
        <div className="header-actions">
          <div className="day-selector">
            <button 
              className={`day-btn ${selectedDay === 'today' ? 'active' : ''}`}
              onClick={() => setSelectedDay('today')}
            >
              Today
            </button>
            <button 
              className={`day-btn ${selectedDay === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedDay('week')}
            >
              This Week
            </button>
          </div>
          <button className="btn-primary">Add New Class</button>
        </div>
      </div>

      <div className="schedule-grid">
        {filteredSchedule.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <div className="class-subject">{cls.subject}</div>
              <div className={`class-status ${cls.status}`}>
                <span className="status-icon">{getStatusIcon(cls.status)}</span>
                <span className="status-text">{cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}</span>
              </div>
            </div>
            
            <div className="class-details">
              <div className="detail-item">
                <span className="detail-icon">🕐</span>
                <span className="detail-text">{cls.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏫</span>
                <span className="detail-text">{cls.room}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <span className="detail-text">{cls.students} students</span>
              </div>
            </div>

            <div className="class-actions">
              {cls.status === 'ongoing' && (
                <button className="btn-action ongoing">Join Class</button>
              )}
              {cls.status === 'upcoming' && (
                <button className="btn-action upcoming">Start Class</button>
              )}
              {cls.status === 'completed' && (
                <button className="btn-action completed">View Recording</button>
              )}
              <button className="btn-secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'ongoing').length}</div>
          <div className="stat-label">Ongoing Classes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'upcoming').length}</div>
          <div className="stat-label">Upcoming Classes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.filter(cls => cls.status === 'completed').length}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{schedule.reduce((sum, cls) => sum + cls.students, 0)}</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>
    </div>
  )
}
