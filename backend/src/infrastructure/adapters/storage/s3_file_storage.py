import os
import boto3
from typing import BinaryIO
from botocore.exceptions import ClientError
from src.application.ports.output.file_storage import DocumentStorage


class S3DocumentStorage(DocumentStorage):
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'eu-west-3')
        )
        self.bucket_name = 'hetic-web3-groupe11-mmotors'
        self.access_point_arn = 'arn:aws:s3:eu-west-3:142706263687:accesspoint/api-mmotors'
        self.access_point_alias = 'api-mmotors-4btmafokcjyy471168o4untc3dq54euw3a-s3alias'
        self.base_url = f"https://{self.access_point_alias}.s3-accesspoint.eu-west-3.amazonaws.com"

    def store(self, file: BinaryIO, filename: str) -> str:
        try:
            extra_args = None
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                extra_args = {'ContentType': f'image/{filename.split(".")[-1].lower()}'}

            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                filename,
                ExtraArgs=extra_args
            )
            return f"{self.base_url}/{filename}"
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def get_url(self, filename: str) -> str:
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=filename)
            return f"{self.base_url}/{filename}"
        except ClientError:
            raise FileNotFoundError(f"File {filename} not found in bucket {self.bucket_name}")

    def get_presigned_url(self, filename: str, expiration: int = 3600) -> str:
        try:
            # Verify file exists before generating URL
            self.s3_client.head_object(Bucket=self.bucket_name, Key=filename)
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': filename
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            raise FileNotFoundError(f"Failed to generate presigned URL for {filename}: {str(e)}")

    def delete(self, filename: str) -> bool:
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=filename)
            return True
        except ClientError:
            return False
