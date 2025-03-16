import os
import boto3
from typing import BinaryIO, List
from botocore.exceptions import ClientError
from src.application.ports.output.file_storage import DocumentStorage


class S3DocumentStorage(DocumentStorage):
    def __init__(self, current_app):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=current_app.config.get('AWS_ACCESS_KEY_ID', 'ChangeMe'),
            aws_secret_access_key=current_app.config.get('AWS_SECRET_ACCESS_KEY', 'ChangeMe'),
            region_name=current_app.config.get('AWS_REGION', 'eu-west-3')
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
        

    def list_objects(self, folder_name: str = "") -> List[str]:
        try:
            bucket = self.s3_resource.Bucket(self.bucket_name)
            return [obj.key for obj in bucket.objects.filter(Prefix=folder_name)]
        except ClientError as e:
            current_app.logger.error(f"Erreur lors de la récupération des fichiers du dossier {folder_name} : {e}")
            raise

    def upload_file(self, file: BinaryIO, file_name: str, folder_name: str = "") -> str:
        try:
            key = f"{folder_name}/{file_name}" if folder_name else file_name
            self.s3_client.upload_fileobj(file, self.bucket_name, key)
            return f"{self.base_url}/{key}"
        except ClientError as e:
            current_app.logger.error(f"Erreur lors du téléversement de {file_name} : {e}")
            raise
    
    def download_file(self, file_name: str, folder_name: str = "", local_path: str = None) -> str:
        try:
            key = f"{folder_name}/{file_name}" if folder_name else file_name
            local_path = local_path or file_name
            self.s3_client.download_file(self.bucket_name, key, local_path)
            return local_path
        except ClientError as e:
            current_app.logger.error(f"Erreur lors du téléchargement de {file_name} : {e}")
            raise