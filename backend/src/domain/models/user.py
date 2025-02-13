from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

@dataclass
class User:
    id: Optional[int] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    email: str
    first_name: str
    last_name: str
    is_active: bool = True
    user_role: str = "client"
    password: str

    def __repr__(self):
        return f"<User {self.email} - {self.user_role}>"
