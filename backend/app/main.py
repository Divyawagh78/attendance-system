from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth_router, attendance_router, subject_router, leave_router, enrollment_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Attendance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(attendance_router.router)
app.include_router(subject_router.router)
app.include_router(leave_router.router)
app.include_router(enrollment_router.router)

@app.get("/")
def root():
    return {"message": "Attendance System API is running"}