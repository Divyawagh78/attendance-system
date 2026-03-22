from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from datetime import date as DateType
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "student", "teacher", "admin"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
class SubjectCreate(BaseModel):
    name: str

class AttendanceCreate(BaseModel):
    student_id: int
    subject_id: int
    date: date
    is_present: bool

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    date: date
    is_present: bool

    class Config:
        from_attributes = True


class LeaveRequestCreate(BaseModel):
    subject_id: int
    date: DateType
    reason: str

class LeaveRequestResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    date: DateType
    reason: str
    status: str

    class Config:
        from_attributes = True