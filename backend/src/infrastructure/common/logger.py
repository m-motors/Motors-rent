import sys
import logging

def setup_logger():
    log_level = logging.DEBUG 
    logging.basicConfig(
        format="%(asctime)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        level=log_level,
        handlers=[logging.StreamHandler(sys.stdout)],
    )
    return logging.getLogger("app")

logger = setup_logger()