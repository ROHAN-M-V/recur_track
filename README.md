# RecurTrack - Subscription & Recurring Expense Tracker

A modern, full-stack subscription management web application built with **React**, **FastAPI**, and **SQLite**.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, Python 3, Uvicorn
- **Database:** SQLite with SQLAlchemy ORM
- **Validation:** Pydantic v2

---

## Getting Started

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --reload
```
API runs at `http://127.0.0.1:8000`  
Interactive Swagger docs available at `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install packages
npm install

# Run development server
npm run dev
```
Frontend runs at `http://localhost:5173`