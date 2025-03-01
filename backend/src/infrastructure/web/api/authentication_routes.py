import time
from flask import request, jsonify, Blueprint

from src.infrastructure.common.regex import Regex
from src.infrastructure.common.logger import logger
from src.infrastructure.web.middleware.validator import Validator, Field
from src.application.services.authentication_service import AuthenticationService


authentication_routes = Blueprint('authentication_routes', __name__)

def create_authentication_routes(authentication_service: AuthenticationService) -> Blueprint:
    
    @authentication_routes.route('/authentication/login', methods=['POST'])
    @Validator(
        json_fields=[
            Field("identification", "str", required=True, match=Regex.email, message="Must be an email"),
            Field("password", "str", required=True)
        ]
    )
    def login():
        start_time = time.perf_counter()
        try:
            data = request.get_json()
            identification = data.get("identification")
            password = data.get("password")

            authentication = authentication_service.login(identification, password)

            if authentication.get("error"):
                response = jsonify({"message": authentication["message"], "content": None, "error": authentication["error"]}), 401
            else:
                response = jsonify({"message": "Login successful", "content": authentication["content"], "error": None}), 200
        except Exception as e:
            logger.error(f"Authentication login error: {str(e)}")
            response = jsonify({"message": "Authentication login failed", "content": None, "error": "Internal Server Error"}), 500

        # Prevent a timing attack by setting a fixed delay of 2 seconds.
        delay : int = 2
        pass_time = time.perf_counter() - start_time
        sleep_time = max(0, delay - pass_time)
        time.sleep(sleep_time)
        return response
    
    return authentication_routes