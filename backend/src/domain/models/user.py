from enum import Enum
from typing import Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field

class UserRole(Enum):
    CLIENT = "client"
    ADMIN = "admin"

@dataclass
class User:
    email: str
    first_name: str
    last_name: str
    password: str
    id: Optional[int] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    user_role: UserRole = UserRole.CLIENT

    def __repr__(self):
        return f"<User {self.email} - {self.user_role}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "created_at": self.created_at.isoformat(), 
            "is_active": self.is_active,
            "user_role": self.user_role.value 
        }

