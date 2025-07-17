



# Venv:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1



# Run
python -m uvicorn main:app --reload
