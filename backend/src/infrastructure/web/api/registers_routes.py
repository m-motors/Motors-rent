from web.api.document_routes import document_routes
from web.api.version_routes import version_routes_blueprint


def setup_blueprints(app):
    
    # API Blueprint (point d'entrée pour les requêtes JSON)
    app.register_blueprint(document_routes, url_prefix='/api')
    app.register_blueprint(version_routes_blueprint, url_prefix='/api')

    return app