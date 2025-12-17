"""
Azure Logic Apps Integration Service
Handles integration with Azure Logic Apps for automated workflows
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, Any, Optional

class LogicAppService:
    def __init__(self):
        self.logic_app_url = os.getenv('AZURE_LOGIC_APP_URL')
        self.logic_app_key = os.getenv('AZURE_LOGIC_APP_KEY')
    
    def trigger_question_workflow(self, question_data: Dict[str, Any]) -> bool:
        """
        Trigger Logic App workflow when a new question is created
        """
        try:
            if not self.logic_app_url:
                print("Logic App URL not configured")
                return False
            
            # Prepare payload for Logic App
            payload = {
                "questionId": question_data.get("id"),
                "userId": question_data.get("userId"),
                "title": question_data.get("title"),
                "mediaUrl": question_data.get("mediaUrl"),
                "mediaType": question_data.get("mediaType"),
                "timestamp": question_data.get("timestamp"),
                "triggerType": "new_question"
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add authentication if key is provided
            if self.logic_app_key:
                headers["Authorization"] = f"Bearer {self.logic_app_key}"
            
            # Send request to Logic App
            response = requests.post(
                self.logic_app_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"Logic App triggered successfully for question {question_data.get('id')}")
                return True
            else:
                print(f"Logic App trigger failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error triggering Logic App: {str(e)}")
            return False
    
    def trigger_answer_workflow(self, question_id: str, answer_data: Dict[str, Any]) -> bool:
        """
        Trigger Logic App workflow when a new answer is added
        """
        try:
            if not self.logic_app_url:
                print("Logic App URL not configured")
                return False
            
            # Prepare payload for Logic App
            payload = {
                "questionId": question_id,
                "answerId": answer_data.get("answerId"),
                "userId": answer_data.get("userId"),
                "textResponse": answer_data.get("textResponse"),
                "mediaUrl": answer_data.get("mediaUrl"),
                "timestamp": answer_data.get("timestamp"),
                "triggerType": "new_answer"
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add authentication if key is provided
            if self.logic_app_key:
                headers["Authorization"] = f"Bearer {self.logic_app_key}"
            
            # Send request to Logic App
            response = requests.post(
                self.logic_app_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"Logic App triggered successfully for answer {answer_data.get('answerId')}")
                return True
            else:
                print(f"Logic App trigger failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error triggering Logic App: {str(e)}")
            return False
    
    def trigger_moderation_workflow(self, content_data: Dict[str, Any]) -> bool:
        """
        Trigger Logic App workflow for content moderation
        """
        try:
            if not self.logic_app_url:
                print("Logic App URL not configured")
                return False
            
            # Prepare payload for Logic App
            payload = {
                "targetType": content_data.get("targetType"),
                "targetId": content_data.get("targetId"),
                "action": content_data.get("action"),
                "moderatorId": content_data.get("moderatorId"),
                "timestamp": datetime.utcnow().isoformat(),
                "triggerType": "content_moderation"
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add authentication if key is provided
            if self.logic_app_key:
                headers["Authorization"] = f"Bearer {self.logic_app_key}"
            
            # Send request to Logic App
            response = requests.post(
                self.logic_app_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"Logic App triggered successfully for moderation action")
                return True
            else:
                print(f"Logic App trigger failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error triggering Logic App: {str(e)}")
            return False
    
    def get_workflow_status(self, run_id: str) -> Optional[Dict[str, Any]]:
        """
        Get the status of a Logic App workflow run
        """
        try:
            if not self.logic_app_url or not run_id:
                return None
            
            # Construct status URL (this would need to be configured based on your Logic App setup)
            status_url = f"{self.logic_app_url}/runs/{run_id}"
            
            headers = {}
            if self.logic_app_key:
                headers["Authorization"] = f"Bearer {self.logic_app_key}"
            
            response = requests.get(status_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Failed to get workflow status: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Error getting workflow status: {str(e)}")
            return None