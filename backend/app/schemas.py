from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date as DateType

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v.strip()

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, v):
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email address")
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v):
        allowed = ["student", "teacher", "admin"]
        if v.lower() not in allowed:
            raise ValueError(f"Role must be one of: {', '.join(allowed)}")
        return v.lower()

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

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Subject name cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Subject name must be at least 2 characters")
        return v.strip()

class AttendanceCreate(BaseModel):
    student_id: int
    subject_id: int
    date: DateType
    is_present: bool

    @field_validator("student_id", "subject_id")
    @classmethod
    def id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("ID must be a positive integer")
        return v

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    date: DateType
    is_present: bool

    class Config:
        from_attributes = True

class EnrollmentCreate(BaseModel):
    subject_id: int

    @field_validator("subject_id")
    @classmethod
    def id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Subject ID must be a positive integer")
        return v

class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int

    class Config:
        from_attributes = True

class LeaveRequestCreate(BaseModel):
    subject_id: int
    date: DateType
    reason: str

    @field_validator("reason")
    @classmethod
    def reason_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Reason cannot be empty")
        if len(v.strip()) < 10:
            raise ValueError("Reason must be at least 10 characters")
        return v.strip()

    @field_validator("subject_id")
    @classmethod
    def id_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Subject ID must be a positive integer")
        return v

class LeaveRequestResponse(BaseModel):
    id: int
    student_id: int
    subject_id: int
    date: DateType
    reason: str
    status: str

    class Config:
        from_attributes = True