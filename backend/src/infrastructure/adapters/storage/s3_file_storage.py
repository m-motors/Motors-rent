import os
import boto3
from typing import BinaryIO
from botocore.exceptions import ClientError

from src.application.ports.output.file_storage import DocumentStorage

class S3DocumentStorage(DocumentStorage):
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            region_name=os.environ['AWS_REGION']
        )
        self.bucket_name = os.environ['S3_BUCKET_NAME']
        self.base_url = f"https://{self.bucket_name}.s3.amazonaws.com"

    def store(self, file: BinaryIO, filename: str) -> str:
        try:
            self.s3_client.upload_fileobj(file, self.bucket_name, filename)
            return f"{self.base_url}/{filename}"
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def get_url(self, filename: str) -> str:
        return f"{self.base_url}/{filename}"

    def delete(self, filename: str) -> bool:
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=filename)
            return True
        except ClientError:
            return False