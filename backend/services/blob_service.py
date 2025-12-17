import os
import uuid
from datetime import datetime, timedelta
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions, ContentSettings
from dotenv import load_dotenv

load_dotenv()

class BlobService:
    def __init__(self):
        self.blob_service_client = BlobServiceClient.from_connection_string(
            os.getenv('AZURE_BLOB_CONNECTION_STRING')
        )
        self.container_name = os.getenv('AZURE_BLOB_CONTAINER_NAME')
        self.account_name = os.getenv('AZURE_STORAGE_ACCOUNT_NAME')
        self.account_key = os.getenv('AZURE_STORAGE_ACCOUNT_KEY')
    
    def upload_file(self, file):
        """Upload file to Azure Blob Storage and return proxy URL"""
        try:
            # Generate unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
            blob_name = f"{uuid.uuid4()}.{file_extension}"
            
            # Determine content type based on file extension
            content_type = self._get_content_type(file_extension)
            
            # Get blob client
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            
            # Upload file with proper content type
            blob_client.upload_blob(
                file.read(), 
                overwrite=True,
                content_settings=ContentSettings(content_type=content_type)
            )
            
            # Return proxy URL through our backend
            return f"/api/media/{blob_name}"
        except Exception as e:
            raise Exception(f"Failed to upload file: {str(e)}")
    
    def _get_content_type(self, file_extension):
        """Get content type based on file extension"""
        extension_map = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg'
        }
        return extension_map.get(file_extension.lower(), 'application/octet-stream')
    
    def get_blob_data(self, blob_name: str):
        """Get blob data for serving through proxy"""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            
            # Download blob data
            blob_data = blob_client.download_blob()
            properties = blob_client.get_blob_properties()
            
            # Get content type from blob properties or determine from filename
            content_type = properties.content_settings.content_type
            if not content_type or content_type == 'application/octet-stream':
                file_extension = blob_name.split('.')[-1] if '.' in blob_name else ''
                content_type = self._get_content_type(file_extension)
            
            return {
                'data': blob_data.readall(),
                'content_type': content_type,
                'content_length': properties.size
            }
        except Exception as e:
            raise Exception(f"Failed to get blob data: {str(e)}")
    
    def generate_upload_url(self, file_name: str, file_type: str) -> dict:
        """Generate SAS URL for direct upload from frontend"""
        try:
            # Generate unique blob name
            file_extension = file_name.split('.')[-1] if '.' in file_name else ''
            blob_name = f"{uuid.uuid4()}.{file_extension}"
            
            # Generate SAS token for upload
            sas_token = generate_blob_sas(
                account_name=self.account_name,
                container_name=self.container_name,
                blob_name=blob_name,
                account_key=self.account_key,
                permission=BlobSasPermissions(write=True, create=True),
                expiry=datetime.utcnow() + timedelta(hours=1)  # 1 hour expiry
            )
            
            # Construct URLs
            upload_url = f"https://{self.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}?{sas_token}"
            public_url = f"https://{self.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}"
            
            return {
                "uploadUrl": upload_url,
                "publicUrl": public_url,
                "blobName": blob_name,
                "expiresAt": (datetime.utcnow() + timedelta(hours=1)).isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate upload URL: {str(e)}")
    
    def delete_blob(self, blob_name: str) -> bool:
        """Delete a blob from storage"""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            blob_client.delete_blob()
            return True
        except Exception as e:
            raise Exception(f"Failed to delete blob: {str(e)}")
    
    def get_blob_properties(self, blob_name: str) -> dict:
        """Get blob properties"""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            properties = blob_client.get_blob_properties()
            
            return {
                "name": blob_name,
                "size": properties.size,
                "contentType": properties.content_settings.content_type,
                "lastModified": properties.last_modified.isoformat(),
                "url": blob_client.url
            }
        except Exception as e:
            raise Exception(f"Failed to get blob properties: {str(e)}")
    
    def list_blobs(self, prefix: str = None) -> list:
        """List all blobs in container"""
        try:
            container_client = self.blob_service_client.get_container_client(self.container_name)
            blobs = container_client.list_blobs(name_starts_with=prefix)
            
            return [
                {
                    "name": blob.name,
                    "size": blob.size,
                    "lastModified": blob.last_modified.isoformat(),
                    "url": f"https://{self.account_name}.blob.core.windows.net/{self.container_name}/{blob.name}"
                }
                for blob in blobs
            ]
        except Exception as e:
            raise Exception(f"Failed to list blobs: {str(e)}")