from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Attendance, User, Subject, LeaveRequest, Enrollment
from app.schemas import AttendanceCreate, AttendanceResponse
from app.dependencies import get_current_user
from datetime import date
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/attendance", tags=["Attendance"])

class BulkAttendanceItem(BaseModel):
    student_id: int
    is_present: bool

@router.get("/students")
def get_all_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    students = db.query(User).filter(User.role == "student").all()
    return [{"id": s.id, "name": s.name, "email": s.email} for s in students]

@router.post("/mark", response_model=AttendanceResponse)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers can mark attendance")
    existing = db.query(Attendance).filter(
        Attendance.student_id == data.student_id,
        Attendance.subject_id == data.subject_id,
        Attendance.date == data.date
    ).first()
    if existing:
        existing.is_present = data.is_present
        db.commit()
        db.refresh(existing)
        return existing
    attendance = Attendance(
        student_id=data.student_id,
        subject_id=data.subject_id,
        date=data.date,
        is_present=data.is_present
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

@router.post("/bulk-mark")
def bulk_mark_attendance(
    subject_id: int,
    date: date,
    attendance_list: List[BulkAttendanceItem],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers can mark attendance")
    for record in attendance_list:
        existing = db.query(Attendance).filter(
            Attendance.student_id == record.student_id,
            Attendance.subject_id == subject_id,
            Attendance.date == date
        ).first()
        if existing:
            existing.is_present = record.is_present
        else:
            new_record = Attendance(
                student_id=record.student_id,
                subject_id=subject_id,
                date=date,
                is_present=record.is_present
            )
            db.add(new_record)
    db.commit()
    return {"message": f"Attendance marked for {len(attendance_list)} students"}

@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
def get_student_attendance(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    return records

@router.get("/percentage/{student_id}/{subject_id}")
def get_attendance_percentage(student_id: int, subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.subject_id == subject_id
    ).count()
    if total == 0:
        return {"percentage": 0, "alert": False}
    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.subject_id == subject_id,
        Attendance.is_present == True
    ).count()
    percentage = round((present / total) * 100, 2)
    alert = percentage < 75
    return {
        "student_id": student_id,
        "subject_id": subject_id,
        "total_classes": total,
        "present": present,
        "percentage": percentage,
        "alert": alert
    }

@router.get("/report/{subject_id}")
def get_attendance_report(subject_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers can view reports")
    records = db.query(Attendance, User).join(
        User, Attendance.student_id == User.id
    ).filter(Attendance.subject_id == subject_id).all()
    result = []
    for attendance, user in records:
        result.append({
            "student_name": user.name,
            "email": user.email,
            "date": str(attendance.date),
            "is_present": attendance.is_present
        })
    return result

@router.get("/admin/summary")
def get_admin_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    students = db.query(User).filter(User.role == "student").all()
    teachers = db.query(User).filter(User.role == "teacher").all()
    subjects = db.query(Subject).all()

    summary = []
    for student in students:
        total = db.query(Attendance).filter(Attendance.student_id == student.id).count()
        present = db.query(Attendance).filter(
            Attendance.student_id == student.id,
            Attendance.is_present == True
        ).count()
        percentage = round((present / total) * 100, 2) if total > 0 else 0
        summary.append({
            "student_id": student.id,
            "student_name": student.name,
            "email": student.email,
            "total_classes": total,
            "present": present,
            "percentage": percentage,
            "alert": percentage < 75 and total > 0
        })

    return {
        "total_students": len(students),
        "total_teachers": len(teachers),
        "total_subjects": len(subjects),
        "student_summary": summary
    }

@router.delete("/admin/delete-student/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.query(Attendance).filter(Attendance.student_id == student_id).delete()
    db.query(Enrollment).filter(Enrollment.student_id == student_id).delete()
    db.query(LeaveRequest).filter(LeaveRequest.student_id == student_id).delete()
    db.delete(student)
    db.commit()

    return {"message": f"Student {student.name} deleted successfully"}
@router.get("/admin/teachers")
def get_all_teachers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    teachers = db.query(User).filter(User.role == "teacher").all()
    return [{"id": t.id, "name": t.name, "email": t.email} for t in teachers]