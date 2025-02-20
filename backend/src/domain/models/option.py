from typing import Optional
from dataclasses import dataclass

@dataclass
class Option:
    id: Optional[int]
    name: str

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
        }
