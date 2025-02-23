import os

port = int(os.getenv("FLASK_INTERNAL_PORT", 5000))

workers = 2
worker_class = 'sync'
bind = f'0.0.0.0:{port}'
timeout = 120
accesslog = '-'
errorlog = '-'
loglevel = 'info'
preload_app = True