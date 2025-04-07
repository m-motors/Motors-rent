import os
import boto3
from datetime import datetime
from typing import BinaryIO, List, Dict
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
        self.s3_resource = boto3.resource(
            's3',
            aws_access_key_id=current_app.config.get('AWS_ACCESS_KEY_ID', 'ChangeMe'),
            aws_secret_access_key=current_app.config.get('AWS_SECRET_ACCESS_KEY', 'ChangeMe'),
            region_name=current_app.config.get('AWS_REGION', 'eu-west-3')
        )
        self.bucket_name = current_app.config.get('AWS_BUCKET_NAME', 'hetic-web3-groupe11-mmotors') 
        self.bucket_region = current_app.config.get('AWS_REGION','eu-west-3') 
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
        




    def list_objects(self, folder_name: str = "") -> Dict:
        try:
            if folder_name and not folder_name.endswith("/"):
                folder_name += "/"

            bucket = self.s3_resource.Bucket(self.bucket_name)

            files_info = []
            folders_info = []

            for obj in bucket.objects.filter(Prefix=folder_name):
                file_url = f"https://s3.{self.bucket_region}.amazonaws.com/{self.bucket_name}/{obj.key}"

                name = os.path.splitext(os.path.basename(obj.key))[0]
                path = os.path.dirname(obj.key)
                extension = os.path.splitext(os.path.basename(obj.key))[1][1:]

                if obj.size == 0 and obj.key.endswith("/"):
                    folders_info.append({
                        "Key": obj.key,
                        "name": name,
                        "path": path,
                        "Size": obj.size,
                        "LastModified": obj.last_modified,
                        "URL": file_url,
                        "StorageClass": obj.storage_class,
                        "ETag": obj.e_tag, 
                        "Extension": extension
                    })
                else:
                    files_info.append({
                        "Key": obj.key,
                        "name": name,
                        "path": path,
                        "Size": obj.size,
                        "LastModified": obj.last_modified,
                        "URL": file_url,
                        "StorageClass": obj.storage_class,
                        "ETag": obj.e_tag, 
                        "Extension": extension
                    })

            if not files_info and not folders_info:
                print(f"Aucun fichier ou dossier trouvé dans {folder_name}")
                return {"files_info": [], "folders_info": []}

            return {
                "files_info": sorted(files_info, key=lambda x: x["LastModified"], reverse=True),
                "folders_info": sorted(folders_info, key=lambda x: x["Key"])
            }

        except ClientError as e:
            print(f"Erreur lors de la récupération des fichiers du dossier {folder_name} : {e}")
            raise

    def upload_file(self, file: BinaryIO, file_name: str, folder_name: str = None) -> Dict:
        try:
            if folder_name and not folder_name.endswith("/"):
                folder_name += "/"

            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            key = f"{folder_name}{timestamp}_{file_name}" if folder_name else f"{timestamp}_{file_name}"

            self.s3_client.upload_fileobj(file, self.bucket_name, key)
            metadata = self.s3_client.head_object(Bucket=self.bucket_name, Key=key)

            file_url = f"https://{self.bucket_name}.s3.amazonaws.com/{key}"
            name = os.path.splitext(os.path.basename(key))[0]
            path = os.path.dirname(key)
            extension = os.path.splitext(file_name)[1][1:]

            value = {
                "Key": key,
                "name": name,
                "path": path,
                "Size": metadata.get("ContentLength"),
                "LastModified": metadata.get("LastModified"),
                "URL": file_url,
                "StorageClass": metadata.get("StorageClass", "STANDARD"),
                "ETag": metadata.get("ETag"),
                "Extension": extension
            }

            return value
        except ClientError as e:
            print(f"Erreur lors du téléversement de {file_name} : {e}")
            raise

    def download_file(self, file_name: str, folder_name: str = None, local_path: str = 'tmp') -> Dict:
        try:
            if folder_name and not folder_name.endswith("/"):
                folder_name += "/"

            key = f"{folder_name}{file_name}" if folder_name else file_name

            os.makedirs(local_path, exist_ok=True)
            local_file_path = os.path.join(local_path, file_name)
            

            self.s3_client.download_file(self.bucket_name, key, local_file_path)

            metadata = self.s3_client.head_object(Bucket=self.bucket_name, Key=key)

            name = os.path.splitext(os.path.basename(key))[0]
            path = os.path.dirname(key)
            extension = os.path.splitext(file_name)[1][1:]
            file_url = f"https://{self.bucket_name}.s3.amazonaws.com/{key}"

            value = {
                "Key": key,
                "name": name,
                "path": path,
                "Size": metadata.get("ContentLength"),
                "LastModified": metadata.get("LastModified"),
                "URL": file_url,
                "StorageClass": metadata.get("StorageClass", "STANDARD"),
                "ETag": metadata.get("ETag"),
                "Extension": extension,
                "LocalPath": local_file_path
            }

            return value
        except ClientError as error:
            if error.response['Error']['Code'] == 'NoSuchKey':
                print(f"[ERROR] Dowload file : {error}")
                raise Exception(f"Dowload file - File not found: {error}") from error
            else:
                print(f"[ERROR] Dowload file : {error}")
                raise Exception(f"Dowload file - ailed to download file: {error}") from error
        
    
    def delete_file(self, file_name: str, folder_name: str = None) -> Dict:
        try:
            if folder_name and not folder_name.endswith("/"):
                folder_name += "/"

            key = f"{folder_name}{file_name}" if folder_name else file_name

            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)

            value = self.list_objects(folder_name)
            return value
        except ClientError as e:
            logging.error(f"Erreur lors de la suppression : {e}")
            return False

