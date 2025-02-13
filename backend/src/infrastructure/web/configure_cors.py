from flask_cors import CORS


def configure_cors(app):
    CORS(app, supports_credentials=True)
    return app 