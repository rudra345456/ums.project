import { useState, useEffect } from 'react'

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.role === 'teacher') {
        loadTeacherData(userData.id)
      }
    }
  }, [])

  const loadTeacherData = async (teacherId) => {
    setLoading(true)
    try {
      // Load classes
      const classesRes = await fetch(`http://127.0.0.1:5000/api/teacher/${teacherId}/classes`)
      const classesData = await classesRes.json()
      if (classesData.ok) setClasses(classesData.classes)

      // Load students
      const studentsRes = await fetch('http://127.0.0.1:5000/api/students')
      const studentsData = await studentsRes.json()
      if (studentsData.ok) setStudents(studentsData.students)
    } catch (error) {
      console.error('Error loading teacher data:', error)
    }
    setLoading(false)
  }

  const loadAttendance = async (classId, date = null) => {
    try {
      const url = `http://127.0.0.1:5000/api/attendance/class/${classId}${date ? `?date=${date}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.ok) {
        setAttendanceData(data.attendance)
      }
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
  }

  const markAttendance = async (studentId, status) => {
    if (!selectedClass) {
      alert('Please select a class first')
      return
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          class_id: selectedClass,
          status: status,
          teacher_id: user.id
        })
      })
      const data = await res.json()
      if (data.ok) {
        alert('Attendance marked successfully!')
        loadAttendance(selectedClass, selectedDate)
      } else {
        alert('Failed to mark attendance')
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Error marking attendance')
    }
  }

  const getStudentStatus = (studentId) => {
    const attendance = attendanceData.find(a => a.student_id === studentId)
    return attendance?.status || 'not-marked'
  }

  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    if (classId) {
      loadAttendance(classId, selectedDate)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    if (selectedClass) {
      loadAttendance(selectedClass, date)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return '#10b981'
      case 'absent': return '#ef4444'
      case 'late': return '#f59e0b'
      case 'not-marked': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusCount = (status) => {
    return attendanceData.filter(a => a.status === status).length
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <div className="header-actions">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => handleDateChange(e.target.value)}
            className="date-picker"
          />
          <select 
            value={selectedClass} 
            onChange={(e) => handleClassChange(e.target.value)}
            className="class-selector"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card present">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('present')}</div>
            <div className="stat-label">Present</div>
          </div>
        </div>
        <div className="stat-card absent">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('absent')}</div>
            <div className="stat-label">Absent</div>
          </div>
        </div>
        <div className="stat-card late">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-number">{getStatusCount('late')}</div>
            <div className="stat-label">Late</div>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{students.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      <div className="attendance-table">
        <div className="table-header">
          <h3>Student Attendance - {selectedDate}</h3>
          <div className="table-actions">
            <button className="btn-secondary">Mark All Present</button>
            <button className="btn-primary">Save Attendance</button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const status = getStudentStatus(student.id)
                return (
                <tr key={student.id}>
                    <td>{student.roll_number}</td>
                  <td>{student.name}</td>
                  <td>
                    <span 
                      className="status-badge" 
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        {status === 'not-marked' ? 'Not Marked' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                          className={`btn-status ${status === 'present' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'present')}
                      >
                        Present
                      </button>
                      <button 
                          className={`btn-status ${status === 'absent' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'absent')}
                      >
                        Absent
                      </button>
                      <button 
                          className={`btn-status ${status === 'late' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'late')}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
