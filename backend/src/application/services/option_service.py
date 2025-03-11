from typing import List, Optional

from src.domain.models.option import Option
from src.application.ports.input.option_use_case import OptionUsecase
from src.application.ports.output.option_repository import OptionRepository

class OptionService(OptionUsecase):
    def __init__(self, option_repository: OptionRepository):
        self.option_repository = option_repository

    def create_option(self, name: str) -> Option:
        option = Option(
            id=None,
            name = name 
        )
        option = self.option_repository.save(option)
        return option

    def list_option(self) -> List[Option]:
        return self.option_repository.find_all()

    def get_option(self, id: int) -> Optional[Option]:
        option = self.option_repository.find_by_id(id)
        return option
    
    def update_option(self, id: int, name: str) -> Option:
        option = self.option_repository.find_by_id(id)
        if not option:
            raise ValueError("Option not found")
        
        option.name = name
        return self.option_repository.update(option)

    def delete_option(self, id: int) -> bool:
        return self.option_repository.delete(id)
