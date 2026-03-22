from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Subject, User
from app.schemas import SubjectCreate
from app.dependencies import get_current_user

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.post("/")
def create_subject(data: SubjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers or admins can create subjects")

    subject = Subject(name=data.name, teacher_id=current_user.id)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return {"message": "Subject created", "id": subject.id, "name": subject.name}

@router.get("/")
def get_all_subjects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subjects = db.query(Subject).all()
    return subjects