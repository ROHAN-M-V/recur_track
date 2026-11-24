from pydantic import BaseModel, ConfigDict

# 1. Base Schema: Shared fields common to all subscription operations
class SubscriptionBase(BaseModel):
    name: str
    cost: float
    cycle: str = "Monthly"
    category: str = "Entertainment"
    renewal_date: str
    status: str = "Active"

# 2. Create Schema: Used when React sends a brand new subscription to be saved
class SubscriptionCreate(SubscriptionBase):
    pass

# 3. Response Schema: Used when FastAPI sends a subscription back to React
class SubscriptionResponse(SubscriptionBase):
    id: int

    # Tells Pydantic to read data from an ORM database model object
    model_config = ConfigDict(from_attributes=True)