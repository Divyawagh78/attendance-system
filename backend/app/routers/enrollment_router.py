from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Enrollment, Subject, User
from app.schemas import EnrollmentCreate
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router.post("/enroll")
def enroll_in_subject(
    data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can enroll")

    subject = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.subject_id == data.subject_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this subject")

    enrollment = Enrollment(
        student_id=current_user.id,
        subject_id=data.subject_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return {"message": f"Enrolled in {subject.name} successfully"}

@router.delete("/unenroll/{subject_id}")
def unenroll_from_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can unenroll")

    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.subject_id == subject_id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Not enrolled in this subject")

    db.delete(enrollment)
    db.commit()
    return {"message": "Unenrolled successfully"}

@router.get("/my-subjects")
def get_my_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Students only")

    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id
    ).all()

    return [{"id": e.subject.id, "name": e.subject.name} for e in enrollments]

@router.get("/subject/{subject_id}/students")
def get_enrolled_students(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Teachers only")

    enrollments = db.query(Enrollment).filter(
        Enrollment.subject_id == subject_id
    ).all()

    return [{"id": e.student.id, "name": e.student.name, "email": e.student.email} for e in enrollments]

@router.get("/all")
def get_all_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Teachers only")

    subjects = db.query(Subject).all()
    result = []
    for subject in subjects:
        count = db.query(Enrollment).filter(
            Enrollment.subject_id == subject.id
        ).count()
        result.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "enrolled_count": count
        })
    return result