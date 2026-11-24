from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# 1. Create the database file and tables naturally on startup
models.Base.metadata.create_all(bind=engine)

# 2. Initialize the FastAPI app
app = FastAPI(title="RecurTrack API")

# 3. CORS Configuration so React can talk to FastAPI
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= API ROUTES =================

# Root health check
@app.get("/")
def read_root():
    return {"message": "RecurTrack API is running!"}


# Route 1: GET ALL subscriptions
@app.get("/subscriptions", response_model=List[schemas.SubscriptionResponse])
def get_subscriptions(db: Session = Depends(get_db)):
    subscriptions = db.query(models.Subscription).all()
    return subscriptions


# Route 2: CREATE a new subscription
@app.post("/subscriptions", response_model=schemas.SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(sub: schemas.SubscriptionCreate, db: Session = Depends(get_db)):
    new_sub = models.Subscription(**sub.model_dump())
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub


# Route 3: DELETE a subscription by ID
@app.delete("/subscriptions/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscription(subscription_id: int, db: Session = Depends(get_db)):
    sub_query = db.query(models.Subscription).filter(models.Subscription.id == subscription_id)
    existing_sub = sub_query.first()

    if not existing_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub_query.delete(synchronize_session=False)
    db.commit()
    return None