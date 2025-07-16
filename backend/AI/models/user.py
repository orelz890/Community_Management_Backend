from pydantic import BaseModel
from typing import List

# Define user schema
class User(BaseModel):
    user_id: int
    hebrew_name: str = None
    phone: str = None
    email: str = None
    city: str = None
    years_of_xp: str = None
    linkedin_url: str = None
    facebook_url: str = None
    description: str = None

class UserScore(BaseModel):
    user_id: int
    score: int

class RateUsersRequest(BaseModel):
    manager_prompt: str
    user_list: List[User]
