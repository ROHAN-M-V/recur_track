from sqlalchemy import Column, Integer, String, Float
from database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    cost = Column(Float, nullable=False)
    cycle = Column(String, default="Monthly")
    category = Column(String, default="Entertainment")
    renewal_date = Column(String, nullable=False)
    status = Column(String, default="Active")