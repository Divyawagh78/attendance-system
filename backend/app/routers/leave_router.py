from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import LeaveRequest, User, Subject
from app.schemas import LeaveRequestCreate, LeaveRequestResponse
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/leave", tags=["Leave Requests"])

@router.post("/apply")
def apply_leave(
    data: LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can apply for leave")

    existing = db.query(LeaveRequest).filter(
        LeaveRequest.student_id == current_user.id,
        LeaveRequest.subject_id == data.subject_id,
        LeaveRequest.date == data.date
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Leave already applied for this date and subject")

    leave = LeaveRequest(
        student_id=current_user.id,
        subject_id=data.subject_id,
        date=data.date,
        reason=data.reason,
        status="pending"
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"message": "Leave application submitted successfully", "id": leave.id}

@router.get("/my-requests", response_model=List[LeaveRequestResponse])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Students only")

    return db.query(LeaveRequest).filter(
        LeaveRequest.student_id == current_user.id
    ).all()

@router.get("/pending")
def get_pending_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Teachers only")

    requests = db.query(LeaveRequest, User, Subject).join(
        User, LeaveRequest.student_id == User.id
    ).join(
        Subject, LeaveRequest.subject_id == Subject.id
    ).all()

    result = []
    for leave, student, subject in requests:
        result.append({
            "id": leave.id,
            "student_name": student.name,
            "email": student.email,
            "subject_name": subject.name,
            "date": str(leave.date),
            "reason": leave.reason,
            "status": leave.status
        })
    return result

@router.put("/action/{leave_id}")
def action_leave(
    leave_id: int,
    action: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Teachers only")

    if action not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Action must be approved or rejected")

    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave.status = action
    db.commit()
    return {"message": f"Leave request {action} successfully"}