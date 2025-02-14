from typing import Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field

@dataclass
class User:
    email: str
    first_name: str
    last_name: str
    password: str
    id: Optional[int] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    user_role: str = "client"

    def __repr__(self):
        return f"<User {self.email} - {self.user_role}>"
