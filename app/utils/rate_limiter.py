from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

class RateLimiter:
    def __init__(self):
        self._questions_tracker: Dict[str, List[datetime]] = defaultdict(list)
        self._answers_tracker: Dict[str, List[datetime]] = defaultdict(list)
    
    def check_question_limit(self, user_id: str, limit: int) -> bool:
        now = datetime.utcnow()
        cutoff = now - timedelta(days=1)
        
        self._questions_tracker[user_id] = [
            timestamp for timestamp in self._questions_tracker[user_id]
            if timestamp > cutoff
        ]
        
        if len(self._questions_tracker[user_id]) >= limit:
            return False
        
        self._questions_tracker[user_id].append(now)
        return True
    
    def check_answer_limit(self, user_id: str, limit: int) -> bool:
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=1)
        
        self._answers_tracker[user_id] = [
            timestamp for timestamp in self._answers_tracker[user_id]
            if timestamp > cutoff
        ]
        
        if len(self._answers_tracker[user_id]) >= limit:
            return False
        
        self._answers_tracker[user_id].append(now)
        return True
    
    def get_question_count(self, user_id: str) -> int:
        now = datetime.utcnow()
        cutoff = now - timedelta(days=1)
        return len([t for t in self._questions_tracker[user_id] if t > cutoff])
    
    def get_answer_count(self, user_id: str) -> int:
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=1)
        return len([t for t in self._answers_tracker[user_id] if t > cutoff])

rate_limiter = RateLimiter()
