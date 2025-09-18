from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import (
    get_teacher_by_email, get_student_by_email, get_teacher_subjects,
    get_all_students, get_classes_by_teacher, mark_attendance, get_attendance_by_class,
    create_assignment, get_assignments_by_teacher, grade_assignment
)


def create_app() -> Flask:
    app = Flask(__name__)

    # Basic config
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
    app.config["UPLOAD_FOLDER"] = "uploads"

    # Enable CORS for local frontend
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

    @app.get("/api/health")
    def health() -> tuple:
        return jsonify({"status": "ok", "service": "gla-ums-backend"}), 200

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"ok": False, "message": "Email and password are required."}), 400

        # Check if user is a teacher
        teacher = get_teacher_by_email(email)
        if teacher and teacher["password"] == password:
            return jsonify({
                "ok": True, 
                "user": {
                    "id": teacher["id"],
                    "name": teacher["name"],
                    "email": teacher["email"],
                    "role": "teacher",
                    "subject": teacher["subject"],
                    "department": teacher["department"]
                }, 
                "token": "teacher-token"
            }), 200

        # Check if user is a student
        student = get_student_by_email(email)
        if student and student["password"] == password:
            return jsonify({
                "ok": True, 
                "user": {
                    "id": student["id"],
                    "name": student["name"],
                    "email": student["email"],
                    "role": "student",
                    "roll_number": student["roll_number"],
                    "class_name": student["class_name"]
                }, 
                "token": "student-token"
            }), 200

        return jsonify({"ok": False, "message": "Invalid credentials."}), 401

    # Teacher endpoints
    @app.get("/api/teacher/<int:teacher_id>/subjects")
    def get_teacher_subjects_api(teacher_id):
        subjects = get_teacher_subjects(teacher_id)
        return jsonify({"ok": True, "subjects": subjects}), 200

    @app.get("/api/teacher/<int:teacher_id>/classes")
    def get_teacher_classes_api(teacher_id):
        classes = get_classes_by_teacher(teacher_id)
        return jsonify({"ok": True, "classes": classes}), 200

    @app.get("/api/students")
    def get_students_api():
        students = get_all_students()
        return jsonify({"ok": True, "students": students}), 200

    @app.post("/api/attendance/mark")
    def mark_attendance_api():
        data = request.get_json()
        student_id = data.get("student_id")
        class_id = data.get("class_id")
        status = data.get("status")
        teacher_id = data.get("teacher_id")

        if not all([student_id, class_id, status, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = mark_attendance(student_id, class_id, status, teacher_id)
        if success:
            return jsonify({"ok": True, "message": "Attendance marked successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to mark attendance"}), 500

    @app.get("/api/attendance/class/<int:class_id>")
    def get_class_attendance_api(class_id):
        date_str = request.args.get("date")
        attendance = get_attendance_by_class(class_id, date_str)
        return jsonify({"ok": True, "attendance": attendance}), 200

    @app.post("/api/assignments/create")
    def create_assignment_api():
        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        subject_id = data.get("subject_id")
        teacher_id = data.get("teacher_id")
        due_date = data.get("due_date")
        max_marks = data.get("max_marks", 100)

        if not all([title, subject_id, teacher_id, due_date]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        assignment_id = create_assignment(title, description, subject_id, teacher_id, due_date, max_marks)
        return jsonify({"ok": True, "assignment_id": assignment_id, "message": "Assignment created successfully"}), 201

    @app.get("/api/teacher/<int:teacher_id>/assignments")
    def get_teacher_assignments_api(teacher_id):
        assignments = get_assignments_by_teacher(teacher_id)
        return jsonify({"ok": True, "assignments": assignments}), 200

    @app.post("/api/assignments/grade")
    def grade_assignment_api():
        data = request.get_json()
        assignment_id = data.get("assignment_id")
        student_id = data.get("student_id")
        marks = data.get("marks")
        feedback = data.get("feedback")
        teacher_id = data.get("teacher_id")

        if not all([assignment_id, student_id, marks, teacher_id]):
            return jsonify({"ok": False, "message": "Missing required fields"}), 400

        success = grade_assignment(assignment_id, student_id, marks, feedback, teacher_id)
        if success:
            return jsonify({"ok": True, "message": "Assignment graded successfully"}), 200
        else:
            return jsonify({"ok": False, "message": "Failed to grade assignment"}), 500

    return app


