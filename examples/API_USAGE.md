# API Usage Examples

## Authentication

### Register Student
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Student123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Student123"
  }'
```

## Student Operations

### Post Question
```bash
curl -X POST http://localhost:5000/student/question \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to implement binary search?",
    "moduleCode": "CS101",
    "questionId": "q-001",
    "description": "Need help with algorithm"
  }'
```

### Post Question with File
```bash
curl -X POST http://localhost:5000/student/question \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=How to implement binary search?" \
  -F "moduleCode=CS101" \
  -F "questionId=q-002" \
  -F "description=Need help with algorithm" \
  -F "file=@/path/to/image.png"
```

### Get All Questions
```bash
curl -X GET http://localhost:5000/student/questions
```

### Get Questions by Module
```bash
curl -X GET "http://localhost:5000/student/questions?moduleCode=CS101"
```

### Get Single Question
```bash
curl -X GET http://localhost:5000/student/question/q-001
```

## Teacher Operations

### Get Questions
```bash
curl -X GET http://localhost:5000/teacher/questions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Answer
```bash
curl -X POST http://localhost:5000/teacher/answer/q-001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answerText": "Binary search works by dividing the array...",
    "metadata": {
      "references": ["CLRS Chapter 2"],
      "difficulty": "intermediate"
    }
  }'
```

### Delete Answer
```bash
curl -X DELETE "http://localhost:5000/teacher/answer/ANSWER_ID?questionId=q-001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Admin Operations

### Get All Data
```bash
curl -X GET http://localhost:5000/admin/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Question
```bash
curl -X DELETE http://localhost:5000/admin/question/q-001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Teacher Account
```bash
curl -X POST http://localhost:5000/admin/create-teacher \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newteacher@example.com",
    "password": "Teacher123"
  }'
```

### Create Student Account
```bash
curl -X POST http://localhost:5000/admin/create-student \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "Student123"
  }'
```

## PowerShell Examples

### Register and Login
```powershell
$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/register" -Method Post -ContentType "application/json" -Body '{"email":"student@example.com","password":"Student123","role":"student"}'

$token = $registerResponse.data.token

$headers = @{
    "Authorization" = "Bearer $token"
}
```

### Post Question
```powershell
$body = @{
    title = "How to implement sorting?"
    moduleCode = "CS101"
    questionId = "q-003"
    description = "Need help with sorting algorithms"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/student/question" -Method Post -Headers $headers -ContentType "application/json" -Body $body
```

### Get Questions
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/student/questions" -Method Get
```
