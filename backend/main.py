import logging

from backend.src.infrastructure.config.config import Config
from src.infrastructure.web.create_app import create_app

logger = logging.getLogger(__name__)

if __name__ == '__main__':

    app = create_app(Config)
    app.run(host='0.0.0.0')