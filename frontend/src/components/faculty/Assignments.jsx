import { useState } from 'react'

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: '',
    subject: '',
    type: 'homework'
  })

  const assignments = [
    {
      id: 1,
      title: 'Data Structures Lab Assignment',
      subject: 'CS-201',
      type: 'lab',
      dueDate: '2024-01-15',
      maxMarks: 100,
      submissions: 35,
      totalStudents: 45,
      status: 'active'
    },
    {
      id: 2,
      title: 'Algorithm Analysis Report',
      subject: 'CS-301',
      type: 'report',
      dueDate: '2024-01-20',
      maxMarks: 50,
      submissions: 42,
      totalStudents: 45,
      status: 'active'
    },
    {
      id: 3,
      title: 'Database Design Project',
      subject: 'CS-401',
      type: 'project',
      dueDate: '2024-01-10',
      maxMarks: 200,
      submissions: 40,
      totalStudents: 40,
      status: 'graded'
    },
    {
      id: 4,
      title: 'Software Engineering Quiz',
      subject: 'CS-501',
      type: 'quiz',
      dueDate: '2024-01-12',
      maxMarks: 25,
      submissions: 38,
      totalStudents: 40,
      status: 'graded'
    }
  ]

  const filteredAssignments = activeTab === 'all' 
    ? assignments 
    : assignments.filter(assignment => assignment.status === activeTab)

  const handleCreateAssignment = (e) => {
    e.preventDefault()
    console.log('Creating assignment:', newAssignment)
    setShowCreateForm(false)
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      maxMarks: '',
      subject: '',
      type: 'homework'
    })
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'homework': return '📝'
      case 'lab': return '🔬'
      case 'project': return '📋'
      case 'quiz': return '❓'
      case 'report': return '📄'
      default: return '📝'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981'
      case 'graded': return '#6b7280'
      case 'draft': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div className="assignments-page">
      <div className="page-header">
        <h2>Assignment Management</h2>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Assignment
          </button>
        </div>
      </div>

      <div className="assignment-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Assignments ({assignments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({assignments.filter(a => a.status === 'active').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
          onClick={() => setActiveTab('graded')}
        >
          Graded ({assignments.filter(a => a.status === 'graded').length})
        </button>
      </div>

      {showCreateForm && (
        <div className="create-assignment-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Assignment Title</label>
                  <input 
                    type="text" 
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Marks</label>
                  <input 
                    type="number" 
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({...newAssignment, maxMarks: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                  >
                    <option value="homework">Homework</option>
                    <option value="lab">Lab Assignment</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                    <option value="report">Report</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-title">
                <span className="type-icon">{getTypeIcon(assignment.type)}</span>
                {assignment.title}
              </div>
              <div className={`assignment-status ${assignment.status}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </div>
            </div>

            <div className="assignment-details">
              <div className="detail-item">
                <span className="detail-label">Subject:</span>
                <span className="detail-value">{assignment.subject}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date:</span>
                <span className="detail-value">{assignment.dueDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Marks:</span>
                <span className="detail-value">{assignment.maxMarks}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submissions:</span>
                <span className="detail-value">{assignment.submissions}/{assignment.totalStudents}</span>
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(assignment.submissions / assignment.totalStudents) * 100}%`}}
              ></div>
            </div>

            <div className="assignment-actions">
              <button className="btn-primary">View Submissions</button>
              <button className="btn-secondary">Edit</button>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
