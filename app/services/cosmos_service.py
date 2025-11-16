from azure.cosmos import CosmosClient, PartitionKey, exceptions
from typing import Dict, List, Optional, Any
from app.config import Config

class CosmosService:
    def __init__(self):
        self.client = None
        self.database = None
        self.users_container = None
        self.questions_container = None
    
    def initialize(self):
        self.client = CosmosClient(Config.COSMOS_ENDPOINT, Config.COSMOS_KEY)
        self.database = self.client.create_database_if_not_exists(id=Config.COSMOS_DATABASE)
        
        self.users_container = self.database.create_container_if_not_exists(
            id="users",
            partition_key=PartitionKey(path="/email")
        )
        
        self.questions_container = self.database.create_container_if_not_exists(
            id="questions",
            partition_key=PartitionKey(path="/questionId")
        )
    
    def create_user(self, user_data: Dict) -> Dict:
        try:
            return self.users_container.create_item(body=user_data)
        except exceptions.CosmosResourceExistsError:
            raise ValueError("User with this email already exists")
        except Exception as e:
            raise Exception(f"Failed to create user: {str(e)}")
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        query = "SELECT * FROM c WHERE c.email = @email"
        parameters = [{"name": "@email", "value": email}]
        
        items = list(self.users_container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=False,
            partition_key=email
        ))
        
        return items[0] if items else None
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        query = "SELECT * FROM c WHERE c.id = @userId"
        parameters = [{"name": "@userId", "value": user_id}]
        
        items = list(self.users_container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        
        return items[0] if items else None
    
    def create_question(self, question_data: Dict) -> Dict:
        try:
            return self.questions_container.create_item(body=question_data)
        except Exception as e:
            raise Exception(f"Failed to create question: {str(e)}")
    
    def get_all_questions(self, module_code: Optional[str] = None) -> List[Dict]:
        if module_code:
            query = "SELECT * FROM c WHERE c.moduleCode = @moduleCode ORDER BY c.createdAt DESC"
            parameters = [{"name": "@moduleCode", "value": module_code}]
        else:
            query = "SELECT * FROM c ORDER BY c.createdAt DESC"
            parameters = []
        
        items = list(self.questions_container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))
        
        return items
    
    def get_question_by_id(self, question_id: str) -> Optional[Dict]:
        try:
            return self.questions_container.read_item(
                item=question_id,
                partition_key=question_id
            )
        except exceptions.CosmosResourceNotFoundError:
            return None
        except Exception as e:
            raise Exception(f"Failed to retrieve question: {str(e)}")
    
    def update_question(self, question_id: str, question_data: Dict) -> Dict:
        try:
            return self.questions_container.upsert_item(body=question_data)
        except Exception as e:
            raise Exception(f"Failed to update question: {str(e)}")
    
    def delete_question(self, question_id: str) -> bool:
        try:
            self.questions_container.delete_item(
                item=question_id,
                partition_key=question_id
            )
            return True
        except exceptions.CosmosResourceNotFoundError:
            return False
        except Exception as e:
            raise Exception(f"Failed to delete question: {str(e)}")
    
    def add_answer_to_question(self, question_id: str, answer_data: Dict) -> Dict:
        question = self.get_question_by_id(question_id)
        if not question:
            raise ValueError("Question not found")
        
        if 'answers' not in question:
            question['answers'] = []
        
        question['answers'].append(answer_data)
        return self.update_question(question_id, question)
    
    def delete_answer_from_question(self, question_id: str, answer_id: str, user_id: str, user_role: str) -> Dict:
        question = self.get_question_by_id(question_id)
        if not question:
            raise ValueError("Question not found")
        
        if 'answers' not in question:
            raise ValueError("No answers found")
        
        answer_index = None
        for idx, answer in enumerate(question['answers']):
            if answer['answerId'] == answer_id:
                if user_role != 'admin' and answer['teacherId'] != user_id:
                    raise PermissionError("You can only delete your own answers")
                answer_index = idx
                break
        
        if answer_index is None:
            raise ValueError("Answer not found")
        
        question['answers'].pop(answer_index)
        return self.update_question(question_id, question)
    
    def get_all_users(self) -> List[Dict]:
        query = "SELECT * FROM c"
        items = list(self.users_container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))
        return items

cosmos_service = CosmosService()
