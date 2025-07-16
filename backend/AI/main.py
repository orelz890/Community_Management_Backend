from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os
from groq import Groq
import json

from config import Config
from models.user import UserScore, RateUsersRequest

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("Missing GROQ_API_KEY in .env")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Initialize FastAPI app
app = FastAPI()


# Define route
@app.post("/rate_users", response_model=List[UserScore])
async def rate_users(payload: RateUsersRequest):
    try:
        system_prompt = Config.SYSTEM_PROMPT

        user_message = {
            "role": "user",
            "content": {
                "manager_prompt": payload.manager_prompt,
                "user_list": [user.dict() for user in payload.user_list]
            }
        }

        # Make the Groq API call
        response = client.chat.completions.create(
            # model="llama3-8b-8192",
            model=Config.MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_message["content"])}
            ],
            temperature=Config.TEMPERATURE,
            max_tokens=Config.MAX_TOKENS
        )

        content = response.choices[0].message.content.strip()

        # Safely parse JSON
        try:
            scores = json.loads(content)
        except json.JSONDecodeError as e:
            print("❌ Failed to parse model response:")
            print(content)
            raise HTTPException(status_code=500, detail=f"Invalid JSON returned by model: {e}")

        # Validate structure
        validated_scores = [UserScore(**item) for item in scores]
        return validated_scores

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API call failed: {e}")
