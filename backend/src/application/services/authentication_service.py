from typing import List
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token

from src.domain.models.user import User
from src.application.ports.output.user_repository import UserRepository
from src.application.ports.input.authentication_use_cases import AuthenticationUseCase


class AuthenticationService(AuthenticationUseCase):
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def login(self, identification: str, password: str) ->  dict:
        try : 
            user =  self.user_repository.find_by_email(identification)

            if not user: 
                return {"message": "Authentification failed", "content": None, "error": 'Authentification service : user not found'}
            
            if not check_password_hash(user.password, password):
                return {"message": "Authentification failed", "content": None, "error": 'Authentification service : wrong password'}

            access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.user_role.value})
            refresh_token = create_refresh_token(identity=str(user.id), additional_claims={"role": user.user_role.value})
            
            return {"message": "Authentication successful", "content": {"access_token": access_token, "refresh_token": refresh_token}, "error": None}
        
        except Exception as e:
            return {"message": "Authentication failed", "content": None, "error": e}
    
    def logout(self, id: int) -> bool:
        pass
