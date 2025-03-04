from src.infrastructure.web.create_app import create_app
from src.infrastructure.config.config import ProductionConfig

app = create_app(ProductionConfig)

if __name__ == "__main__":
    app.logger.info("Starting Flask application ...")
    app.run()