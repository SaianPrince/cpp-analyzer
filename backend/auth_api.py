from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr, Field, validator
from database import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
import models

router = APIRouter(prefix="/auth", tags=["Authentication"])


# --- Schemas ---

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=128)

    @validator("username")
    def validate_username(cls, v):
        if not v.strip():
            raise ValueError("Username cannot be empty")
        return v.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    plan: str


# --- Endpoints ---

@router.post("/register", response_model=AuthResponse, summary="Register a new user")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account with email, username and password.
    Returns a JWT token on successful registration.
    """
    # Check if email already exists
    stmt = select(models.User).where(models.User.email == request.email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    # Create user
    user = models.User(
        email=request.email,
        username=request.username,
        hashed_password=hash_password(request.password),
        plan="free",
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate token
    token = create_access_token(data={"sub": user.id})

    return AuthResponse(
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "plan": user.plan,
        },
    )


@router.post("/login", response_model=AuthResponse, summary="Login to an existing account")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate with email and password.
    Returns a JWT token on successful login.
    """
    stmt = select(models.User).where(models.User.email == request.email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.id})

    return AuthResponse(
        token=token,
        user={
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "plan": user.plan,
        },
    )


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
async def get_me(user: models.User = Depends(get_current_user)):
    """
    Returns the profile of the currently authenticated user.
    Requires a valid JWT token in the Authorization header.
    """
    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        plan=user.plan,
    )
