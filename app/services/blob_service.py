from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
import uuid
import os
from app.config import Config

class BlobService:
    def __init__(self):
        self.blob_service_client = None
        self.container_name = Config.BLOB_CONTAINER
    
    def initialize(self):
        self.blob_service_client = BlobServiceClient.from_connection_string(
            Config.BLOB_CONNECTION_STRING
        )
        
        try:
            container_client = self.blob_service_client.get_container_client(self.container_name)
            if not container_client.exists():
                container_client.create_container()
        except Exception as e:
            raise Exception(f"Failed to initialize blob container: {str(e)}")
    
    def upload_file(self, file_data, original_filename: str) -> str:
        try:
            file_extension = original_filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=unique_filename
            )
            
            blob_client.upload_blob(file_data, overwrite=True)
            
            blob_url = blob_client.url
            return blob_url
        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")
    
    def generate_signed_url(self, blob_name: str, expiry_hours: int = 24) -> str:
        try:
            account_name = self.blob_service_client.account_name
            account_key = Config.BLOB_CONNECTION_STRING.split('AccountKey=')[1].split(';')[0]
            
            sas_token = generate_blob_sas(
                account_name=account_name,
                container_name=self.container_name,
                blob_name=blob_name,
                account_key=account_key,
                permission=BlobSasPermissions(read=True),
                expiry=datetime.utcnow() + timedelta(hours=expiry_hours)
            )
            
            return f"https://{account_name}.blob.core.windows.net/{self.container_name}/{blob_name}?{sas_token}"
        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")
    
    def delete_file(self, blob_name: str) -> bool:
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            blob_client.delete_blob()
            return True
        except Exception as e:
            return False

blob_service = BlobService()
