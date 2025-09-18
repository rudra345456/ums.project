import sqlite3
import os
from datetime import datetime, date
from typing import List, Dict, Optional

DATABASE_PATH = 'ums_database.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize database with all required tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create teachers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            subject TEXT NOT NULL,
            department TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create students table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            roll_number TEXT UNIQUE NOT NULL,
            class_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create subjects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            teacher_id INTEGER,
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create classes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            schedule_time TEXT,
            room_number TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create attendance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            class_id INTEGER NOT NULL,
            date DATE NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
            marked_by INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (class_id) REFERENCES classes (id),
            FOREIGN KEY (marked_by) REFERENCES teachers (id),
            UNIQUE(student_id, class_id, date)
        )
    ''')
    
    # Create assignments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            due_date DATE,
            max_marks INTEGER DEFAULT 100,
            file_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create assignment_submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assignment_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assignment_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            file_path TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            marks_obtained INTEGER,
            feedback TEXT,
            graded_by INTEGER,
            graded_at TIMESTAMP,
            FOREIGN KEY (assignment_id) REFERENCES assignments (id),
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (graded_by) REFERENCES teachers (id),
            UNIQUE(assignment_id, student_id)
        )
    ''')
    
    # Create exams table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            exam_date DATE NOT NULL,
            max_marks INTEGER DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (subject_id) REFERENCES subjects (id),
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )
    ''')
    
    # Create exam_results table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            marks_obtained INTEGER NOT NULL,
            feedback TEXT,
            graded_by INTEGER NOT NULL,
            graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (exam_id) REFERENCES exams (id),
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (graded_by) REFERENCES teachers (id),
            UNIQUE(exam_id, student_id)
        )
    ''')
    
    conn.commit()
    conn.close()

def create_sample_data():
    """Create sample data for testing"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Sample teachers with subjects
    teachers_data = [
        ('Dr. Rajesh Kumar', 'rajesh.kumar@gla.edu', 'password123', 'Mathematics', 'Engineering'),
        ('Prof. Priya Sharma', 'priya.sharma@gla.edu', 'password123', 'Physics', 'Science'),
        ('Dr. Amit Singh', 'amit.singh@gla.edu', 'password123', 'Chemistry', 'Science'),
        ('Prof. Sunita Verma', 'sunita.verma@gla.edu', 'password123', 'Computer Science', 'Engineering'),
        ('Dr. Vikram Patel', 'vikram.patel@gla.edu', 'password123', 'English Literature', 'Arts'),
        ('Prof. Neha Gupta', 'neha.gupta@gla.edu', 'password123', 'Business Studies', 'Commerce'),
        ('Dr. Ravi Tiwari', 'ravi.tiwari@gla.edu', 'password123', 'History', 'Arts'),
        ('Prof. Kavita Joshi', 'kavita.joshi@gla.edu', 'password123', 'Biology', 'Science'),
        ('Dr. Suresh Kumar', 'suresh.kumar@gla.edu', 'password123', 'Economics', 'Commerce'),
        ('Prof. Meera Singh', 'meera.singh@gla.edu', 'password123', 'Psychology', 'Arts')
    ]
    
    # Insert teachers
    cursor.executemany('''
        INSERT OR IGNORE INTO teachers (name, email, password, subject, department)
        VALUES (?, ?, ?, ?, ?)
    ''', teachers_data)
    
    # Sample students
    students_data = [
        ('Arjun Sharma', 'arjun.sharma@student.gla.edu', 'student123', 'CS001', 'Computer Science'),
        ('Priya Patel', 'priya.patel@student.gla.edu', 'student123', 'CS002', 'Computer Science'),
        ('Rahul Kumar', 'rahul.kumar@student.gla.edu', 'student123', 'CS003', 'Computer Science'),
        ('Sneha Singh', 'sneha.singh@student.gla.edu', 'student123', 'CS004', 'Computer Science'),
        ('Vikram Tiwari', 'vikram.tiwari@student.gla.edu', 'student123', 'CS005', 'Computer Science'),
        ('Ananya Verma', 'ananya.verma@student.gla.edu', 'student123', 'CS006', 'Computer Science'),
        ('Karan Joshi', 'karan.joshi@student.gla.edu', 'student123', 'CS007', 'Computer Science'),
        ('Divya Gupta', 'divya.gupta@student.gla.edu', 'student123', 'CS008', 'Computer Science'),
        ('Rohit Sharma', 'rohit.sharma@student.gla.edu', 'student123', 'CS009', 'Computer Science'),
        ('Pooja Patel', 'pooja.patel@student.gla.edu', 'student123', 'CS010', 'Computer Science'),
        ('Amit Kumar', 'amit.kumar@student.gla.edu', 'student123', 'CS011', 'Computer Science'),
        ('Kavya Singh', 'kavya.singh@student.gla.edu', 'student123', 'CS012', 'Computer Science'),
        ('Raj Tiwari', 'raj.tiwari@student.gla.edu', 'student123', 'CS013', 'Computer Science'),
        ('Shreya Verma', 'shreya.verma@student.gla.edu', 'student123', 'CS014', 'Computer Science'),
        ('Manish Joshi', 'manish.joshi@student.gla.edu', 'student123', 'CS015', 'Computer Science'),
        ('Riya Gupta', 'riya.gupta@student.gla.edu', 'student123', 'CS016', 'Computer Science'),
        ('Suresh Sharma', 'suresh.sharma@student.gla.edu', 'student123', 'CS017', 'Computer Science'),
        ('Neha Patel', 'neha.patel@student.gla.edu', 'student123', 'CS018', 'Computer Science'),
        ('Vishal Kumar', 'vishal.kumar@student.gla.edu', 'student123', 'CS019', 'Computer Science'),
        ('Deepika Singh', 'deepika.singh@student.gla.edu', 'student123', 'CS020', 'Computer Science')
    ]
    
    # Insert students
    cursor.executemany('''
        INSERT OR IGNORE INTO students (name, email, password, roll_number, class_name)
        VALUES (?, ?, ?, ?, ?)
    ''', students_data)
    
    # Create subjects for each teacher
    cursor.execute('SELECT id, subject FROM teachers')
    teachers = cursor.fetchall()
    
    for teacher in teachers:
        cursor.execute('''
            INSERT OR IGNORE INTO subjects (name, code, teacher_id)
            VALUES (?, ?, ?)
        ''', (teacher[1], f'{teacher[1].replace(" ", "").upper()[:3]}101', teacher[0]))
    
    # Create sample classes
    cursor.execute('SELECT id, teacher_id FROM subjects LIMIT 5')
    subjects = cursor.fetchall()
    
    for i, subject in enumerate(subjects):
        cursor.execute('''
            INSERT OR IGNORE INTO classes (name, subject_id, teacher_id, schedule_time, room_number)
            VALUES (?, ?, ?, ?, ?)
        ''', (f'Subject {subject[0]} Class', subject[0], subject[1], 
              f'Monday {9+i}:00 AM', f'Room {101+i}'))
    
    conn.commit()
    conn.close()

# Database helper functions
def get_teacher_by_email(email: str) -> Optional[Dict]:
    """Get teacher by email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM teachers WHERE email = ?', (email,))
    teacher = cursor.fetchone()
    conn.close()
    return dict(teacher) if teacher else None

def get_student_by_email(email: str) -> Optional[Dict]:
    """Get student by email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students WHERE email = ?', (email,))
    student = cursor.fetchone()
    conn.close()
    return dict(student) if student else None

def get_teacher_subjects(teacher_id: int) -> List[Dict]:
    """Get subjects taught by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT s.*, t.name as teacher_name 
        FROM subjects s 
        JOIN teachers t ON s.teacher_id = t.id 
        WHERE s.teacher_id = ?
    ''', (teacher_id,))
    subjects = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return subjects

def get_all_students() -> List[Dict]:
    """Get all students"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM students ORDER BY name')
    students = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return students

def get_classes_by_teacher(teacher_id: int) -> List[Dict]:
    """Get classes taught by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.*, s.name as subject_name, s.code as subject_code
        FROM classes c
        JOIN subjects s ON c.subject_id = s.id
        WHERE c.teacher_id = ?
        ORDER BY c.created_at DESC
    ''', (teacher_id,))
    classes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return classes

def mark_attendance(student_id: int, class_id: int, status: str, teacher_id: int) -> bool:
    """Mark attendance for a student"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO attendance (student_id, class_id, date, status, marked_by)
            VALUES (?, ?, ?, ?, ?)
        ''', (student_id, class_id, date.today().isoformat(), status, teacher_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.close()
        return False

def get_attendance_by_class(class_id: int, date_str: str = None) -> List[Dict]:
    """Get attendance for a class on a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if date_str is None:
        date_str = date.today().isoformat()
    
    cursor.execute('''
        SELECT a.*, s.name as student_name, s.roll_number
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.class_id = ? AND a.date = ?
        ORDER BY s.name
    ''', (class_id, date_str))
    
    attendance = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return attendance

def create_assignment(title: str, description: str, subject_id: int, teacher_id: int, 
                     due_date: str, max_marks: int, file_path: str = None) -> int:
    """Create a new assignment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO assignments (title, description, subject_id, teacher_id, due_date, max_marks, file_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, subject_id, teacher_id, due_date, max_marks, file_path))
    assignment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return assignment_id

def get_assignments_by_teacher(teacher_id: int) -> List[Dict]:
    """Get assignments created by a teacher"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT a.*, s.name as subject_name
        FROM assignments a
        JOIN subjects s ON a.subject_id = s.id
        WHERE a.teacher_id = ?
        ORDER BY a.created_at DESC
    ''', (teacher_id,))
    assignments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return assignments

def grade_assignment(assignment_id: int, student_id: int, marks: int, feedback: str, teacher_id: int) -> bool:
    """Grade an assignment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            UPDATE assignment_submissions 
            SET marks_obtained = ?, feedback = ?, graded_by = ?, graded_at = CURRENT_TIMESTAMP
            WHERE assignment_id = ? AND student_id = ?
        ''', (marks, feedback, teacher_id, assignment_id, student_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.close()
        return False

# Initialize database when module is imported
init_database()
create_sample_data()
