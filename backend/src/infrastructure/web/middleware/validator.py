import re
from functools import wraps
from flask import request, jsonify

class Field:
    def __init__(self, label, field_type, required=True, match=None, message=''):
        self.label = label
        self.field_type = field_type
        self.required = required
        self.match = match
        self.message = message

    def validate(self, value):
        if value is None:
            return not self.required
        
        if not isinstance(value, self.get_python_type()):
            return False
        
        if self.match and isinstance(value, str) and not re.match(self.match, value):
            return False
        
        return True

    def get_python_type(self):
        type_mapping = {
            "str": str,
            "int": int,
            "float": float,
            "bool": bool, 
            "dict" : dict,
            "list" : list,
        }
        return type_mapping.get(self.field_type, str)
    
class Validator:
    def __init__(self, json_fields=None, header_fields=None, query_fields=None):
        self.json_fields = json_fields or []
        self.header_fields = header_fields or []
        self.query_fields = query_fields or []

    def validate_request(self):
        errors = []

        if self.json_fields and request.content_type != "application/json":
            return {"message": "Invalid Content-Type, expected application/json"}
        data = request.get_json() or {}
        if self.json_fields:
            errors.extend(self.validate_fields(self.json_fields, data, "body"))

        errors.extend(self.validate_fields(self.header_fields, request.headers, "header"))

        errors.extend(self.validate_fields(self.query_fields, request.args, "query"))

        allowed_keys = {field.label for field in self.json_fields}
        extra_keys = set(data.keys()) - allowed_keys
        if extra_keys:
            errors.append(f"Unexpected fields in body: {', '.join(extra_keys)}")
        return errors if errors else None

    def validate_fields(self, fields, source, source_name):
        errors = []
        for field in fields:
            value = source.get(field.label)

            if not field.validate(value):
                errors.append(f"Invalid or missing field '{field.label}' in {source_name}, {field.message}")

        return errors

    def __call__(self, f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            errors = self.validate_request()
            if errors:
                return jsonify({"message": "Invalid request", 'content': None, "error": errors}), 400
            return f(*args, **kwargs)
        return wrapper