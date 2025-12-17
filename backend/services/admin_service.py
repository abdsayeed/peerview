from datetime import datetime
from azure.cosmos import exceptions
from services.cosmos_service import CosmosService
from services.blob_service import BlobService

class AdminService:
    def __init__(self):
        self.cosmos_service = CosmosService()
        self.blob_service = BlobService()
    
    def get_system_stats(self) -> dict:
        """Get system statistics"""
        try:
            # Get total users
            users_query = "SELECT VALUE COUNT(1) FROM c WHERE c.email != null"
            users_container = self.cosmos_service.database.get_container_client('Users')
            total_users = list(users_container.query_items(
                query=users_query,
                enable_cross_partition_query=True
            ))[0]
            
            # Get total questions
            questions_query = "SELECT VALUE COUNT(1) FROM c WHERE c.title != null"
            total_questions = list(self.cosmos_service.container.query_items(
                query=questions_query,
                enable_cross_partition_query=True
            ))[0]
            
            # Get total answers
            answers_query = "SELECT VALUE SUM(ARRAY_LENGTH(c.answers)) FROM c WHERE c.answers != null"
            total_answers_result = list(self.cosmos_service.container.query_items(
                query=answers_query,
                enable_cross_partition_query=True
            ))
            total_answers = total_answers_result[0] if total_answers_result[0] else 0
            
            # Get questions by status
            answered_query = "SELECT VALUE COUNT(1) FROM c WHERE c.status = 'answered'"
            pending_query = "SELECT VALUE COUNT(1) FROM c WHERE c.status = 'pending'"
            
            answered_questions = list(self.cosmos_service.container.query_items(
                query=answered_query,
                enable_cross_partition_query=True
            ))[0]
            
            pending_questions = list(self.cosmos_service.container.query_items(
                query=pending_query,
                enable_cross_partition_query=True
            ))[0]
            
            # Get recent activity (last 7 days)
            from datetime import datetime, timedelta
            week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
            recent_query = f"SELECT VALUE COUNT(1) FROM c WHERE c.timestamp >= '{week_ago}'"
            recent_questions = list(self.cosmos_service.container.query_items(
                query=recent_query,
                enable_cross_partition_query=True
            ))[0]
            
            return {
                "totalUsers": total_users,
                "totalQuestions": total_questions,
                "totalAnswers": total_answers,
                "answeredQuestions": answered_questions,
                "pendingQuestions": pending_questions,
                "recentQuestions": recent_questions,
                "storageUsage": "N/A",  # Would need Azure Storage API to get actual usage
                "lastUpdated": datetime.utcnow().isoformat()
            }
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get system stats: {e.message}")
    
    def moderate_content(self, target_type: str, target_id: str, action: str, moderator_id: str) -> dict:
        """Moderate content (remove, flag, etc.)"""
        try:
            if target_type == "question":
                return self._moderate_question(target_id, action, moderator_id)
            elif target_type == "answer":
                return self._moderate_answer(target_id, action, moderator_id)
            else:
                raise Exception("Invalid target type")
                
        except Exception as e:
            raise Exception(f"Failed to moderate content: {str(e)}")
    
    def _moderate_question(self, question_id: str, action: str, moderator_id: str) -> dict:
        """Moderate a question"""
        try:
            question = self.cosmos_service.get_question(question_id)
            if not question:
                raise Exception("Question not found")
            
            if action == "remove":
                # Soft delete by adding moderation info
                question["moderated"] = True
                question["moderatedBy"] = moderator_id
                question["moderatedAt"] = datetime.utcnow().isoformat()
                question["moderationAction"] = "removed"
                question["status"] = "removed"
                
                updated_question = self.cosmos_service.container.replace_item(
                    item=question_id, 
                    body=question
                )
                
                return {
                    "success": True,
                    "message": "Question removed successfully",
                    "questionId": question_id,
                    "action": action
                }
            
            elif action == "flag":
                # Add flag without removing
                if "flags" not in question:
                    question["flags"] = []
                
                question["flags"].append({
                    "flaggedBy": moderator_id,
                    "flaggedAt": datetime.utcnow().isoformat(),
                    "reason": "Admin review"
                })
                
                updated_question = self.cosmos_service.container.replace_item(
                    item=question_id, 
                    body=question
                )
                
                return {
                    "success": True,
                    "message": "Question flagged successfully",
                    "questionId": question_id,
                    "action": action
                }
            
            else:
                raise Exception("Invalid moderation action")
                
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to moderate question: {e.message}")
    
    def _moderate_answer(self, answer_id: str, action: str, moderator_id: str) -> dict:
        """Moderate an answer"""
        try:
            # Find the question containing this answer
            query = "SELECT * FROM c WHERE ARRAY_CONTAINS(c.answers, {'answerId': @answerId}, true)"
            parameters = [{"name": "@answerId", "value": answer_id}]
            
            questions = list(self.cosmos_service.container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            if not questions:
                raise Exception("Answer not found")
            
            question = questions[0]
            
            # Find and moderate the specific answer
            for i, answer in enumerate(question["answers"]):
                if answer["answerId"] == answer_id:
                    if action == "remove":
                        answer["moderated"] = True
                        answer["moderatedBy"] = moderator_id
                        answer["moderatedAt"] = datetime.utcnow().isoformat()
                        answer["moderationAction"] = "removed"
                        answer["textResponse"] = "[This answer has been removed by moderation]"
                        
                    elif action == "flag":
                        if "flags" not in answer:
                            answer["flags"] = []
                        
                        answer["flags"].append({
                            "flaggedBy": moderator_id,
                            "flaggedAt": datetime.utcnow().isoformat(),
                            "reason": "Admin review"
                        })
                    
                    break
            
            # Update the question with moderated answer
            updated_question = self.cosmos_service.container.replace_item(
                item=question["id"], 
                body=question
            )
            
            return {
                "success": True,
                "message": f"Answer {action}d successfully",
                "answerId": answer_id,
                "action": action
            }
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to moderate answer: {e.message}")
    
    def get_flagged_content(self) -> dict:
        """Get all flagged content for review"""
        try:
            # Get flagged questions
            flagged_questions_query = "SELECT * FROM c WHERE IS_DEFINED(c.flags) AND ARRAY_LENGTH(c.flags) > 0"
            flagged_questions = list(self.cosmos_service.container.query_items(
                query=flagged_questions_query,
                enable_cross_partition_query=True
            ))
            
            # Get questions with flagged answers
            flagged_answers_query = "SELECT * FROM c WHERE EXISTS(SELECT VALUE a FROM a IN c.answers WHERE IS_DEFINED(a.flags))"
            questions_with_flagged_answers = list(self.cosmos_service.container.query_items(
                query=flagged_answers_query,
                enable_cross_partition_query=True
            ))
            
            return {
                "flaggedQuestions": flagged_questions,
                "questionsWithFlaggedAnswers": questions_with_flagged_answers,
                "totalFlagged": len(flagged_questions) + len(questions_with_flagged_answers)
            }
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get flagged content: {e.message}")
    
    def get_user_activity(self, user_id: str) -> dict:
        """Get detailed user activity"""
        try:
            # Get user's questions
            user_questions_query = "SELECT * FROM c WHERE c.userId = @userId"
            parameters = [{"name": "@userId", "value": user_id}]
            
            user_questions = list(self.cosmos_service.container.query_items(
                query=user_questions_query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            # Get user's answers
            user_answers_query = "SELECT c.id, c.title, a FROM c JOIN a IN c.answers WHERE a.userId = @userId"
            user_answers = list(self.cosmos_service.container.query_items(
                query=user_answers_query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            return {
                "userId": user_id,
                "questionsAsked": len(user_questions),
                "answersProvided": len(user_answers),
                "questions": user_questions,
                "answers": user_answers
            }
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get user activity: {e.message}")