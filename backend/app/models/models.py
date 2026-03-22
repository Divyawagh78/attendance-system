from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    teacher = relationship("User")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(Date, nullable=False)
    is_present = Column(Boolean, default=False)

    student = relationship("User", foreign_keys=[student_id])
    subject = relationship("Subject")

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected

    student = relationship("User", foreign_keys=[student_id])
    subject = relationship("Subject")