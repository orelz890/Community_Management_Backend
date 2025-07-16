from pydantic import BaseModel
from typing import List
from typing import Optional

# Define user schema
class User(BaseModel):
    user_id: int
    hebrew_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    years_of_xp: Optional[str] = None
    linkedin_url: Optional[str] = None
    facebook_url: Optional[str] = None
    description: Optional[str] = None
    role: Optional[str] = None
    seniority: Optional[str] = None
    english_name: Optional[str] = None

class UserScore(BaseModel):
    user_id: int
    score: int

class RateUsersRequest(BaseModel):
    manager_prompt: str
    user_list: List[User]
