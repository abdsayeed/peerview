import os
import uuid
from datetime import datetime
from azure.cosmos import CosmosClient, exceptions
from dotenv import load_dotenv

load_dotenv()

class CosmosService:
    def __init__(self):
        self.client = CosmosClient(
            os.getenv('AZURE_COSMOS_URI'),
            os.getenv('AZURE_COSMOS_KEY')
        )
        self.database = self.client.get_database_client(os.getenv('AZURE_COSMOS_DB_NAME'))
        self.container = self.database.get_container_client(os.getenv('AZURE_COSMOS_CONTAINER_NAME'))
    
    def get_questions(self):
        """Get all questions ordered by timestamp descending"""
        try:
            query = "SELECT * FROM c ORDER BY c.timestamp DESC"
            items = list(self.container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
            return items
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get questions: {e.message}")
    
    def get_question(self, question_id):
        """Get a specific question by ID"""
        try:
            return self.container.read_item(item=question_id, partition_key=question_id)
        except exceptions.CosmosResourceNotFoundError:
            return None
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get question: {e.message}")
    
    def create_question(self, user_id, title, caption, media_url, media_type="image"):
        """Create a new question"""
        try:
            question_id = str(uuid.uuid4())
            question = {
                "id": question_id,
                "userId": user_id,
                "title": title,
                "mediaUrl": media_url,
                "mediaType": media_type,
                "caption": caption,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "pending",
                "answers": []
            }
            
            created_item = self.container.create_item(body=question)
            return created_item
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to create question: {e.message}")
    
    def update_question(self, question_id, title, caption, media_url=None, media_type=None):
        """Update an existing question"""
        try:
            # Get the existing question
            question = self.get_question(question_id)
            if not question:
                return None
            
            # Update the fields
            question["title"] = title
            question["caption"] = caption
            if media_url is not None:
                question["mediaUrl"] = media_url
            if media_type is not None:
                question["mediaType"] = media_type
            
            # Update the question in Cosmos DB
            updated_item = self.container.replace_item(item=question_id, body=question)
            return updated_item
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to update question: {e.message}")
    
    def get_questions_paginated(self, page=1, limit=20):
        """Get questions with pagination"""
        try:
            offset = (page - 1) * limit
            query = f"SELECT * FROM c WHERE (NOT IS_DEFINED(c.moderated) OR c.moderated = false) ORDER BY c.timestamp DESC OFFSET {offset} LIMIT {limit}"
            items = list(self.container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
            return items
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get questions: {e.message}")
    
    def delete_question(self, question_id):
        """Delete a question"""
        try:
            self.container.delete_item(item=question_id, partition_key=question_id)
            return True
        except exceptions.CosmosResourceNotFoundError:
            return False
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to delete question: {e.message}")
    
    def add_answer(self, question_id, user_id, text_response, media_url=None):
        """Add an answer to a question"""
        try:
            # Get the existing question
            question = self.get_question(question_id)
            if not question:
                return None
            
            # Create new answer
            answer = {
                "answerId": str(uuid.uuid4()),
                "userId": user_id,
                "mediaUrl": media_url,
                "textResponse": text_response,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Add answer to the question
            question["answers"].append(answer)
            question["status"] = "answered"
            
            # Update the question in Cosmos DB
            updated_item = self.container.replace_item(item=question_id, body=question)
            return answer
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to add answer: {e.message}")
    
    def update_answer(self, answer_id, user_id, text_response, media_url, user_role):
        """Update an existing answer"""
        try:
            # Find the question containing this answer
            query = "SELECT * FROM c WHERE ARRAY_CONTAINS(c.answers, {'answerId': @answerId}, true)"
            parameters = [{"name": "@answerId", "value": answer_id}]
            
            questions = list(self.container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            if not questions:
                return None
            
            question = questions[0]
            
            # Find and update the specific answer
            for i, answer in enumerate(question["answers"]):
                if answer["answerId"] == answer_id:
                    # Check permissions
                    if user_role != 'admin' and answer["userId"] != user_id:
                        return None
                    
                    # Update answer
                    answer["textResponse"] = text_response
                    if media_url is not None:
                        answer["mediaUrl"] = media_url
                    answer["updatedAt"] = datetime.utcnow().isoformat()
                    answer["updatedBy"] = user_id
                    
                    # Update the question
                    updated_question = self.container.replace_item(item=question["id"], body=question)
                    return answer
            
            return None
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to update answer: {e.message}")
    
    def delete_answer(self, answer_id, user_id, user_role):
        """Delete an answer"""
        try:
            # Find the question containing this answer
            query = "SELECT * FROM c WHERE ARRAY_CONTAINS(c.answers, {'answerId': @answerId}, true)"
            parameters = [{"name": "@answerId", "value": answer_id}]
            
            questions = list(self.container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            if not questions:
                return False
            
            question = questions[0]
            
            # Find and remove the specific answer
            for i, answer in enumerate(question["answers"]):
                if answer["answerId"] == answer_id:
                    # Check permissions
                    if user_role != 'admin' and answer["userId"] != user_id:
                        return False
                    
                    # Remove answer
                    question["answers"].pop(i)
                    
                    # Update question status if no answers left
                    if len(question["answers"]) == 0:
                        question["status"] = "pending"
                    
                    # Update the question
                    self.container.replace_item(item=question["id"], body=question)
                    return True
            
            return False
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to delete answer: {e.message}")