Here is the complete list of API endpoints for the PeerView application in plain text format.

Base URL: https://api.peerview.com/v1

AUTHENTICATION

POST /auth/login

Description: Authenticates a user and returns a JWT token with their role.

Payload: { "email": "user@uni.edu", "password": "..." }

POST /auth/register

Description: Registers a new Student account.

Payload: { "email": "...", "password": "...", "fullName": "..." }

GET /users/me

Description: Get the current user's profile details.

MEDIA (AZURE BLOB)

POST /media/upload-url

Description: Generates a Secure Access Signature (SAS) URL so the frontend can upload files directly to Azure.

Payload: { "fileName": "video.mp4", "fileType": "video/mp4" }

Response: { "uploadUrl": "https://azureblob...", "publicUrl": "https://..." }

QUESTIONS (FEED)

GET /questions

Description: Retrieves the main Q&A feed. Supports pagination.

Query Params: ?page=1&limit=20

POST /questions

Description: Creates a new question (Student only).

Payload: { "title": "...", "caption": "...", "mediaUrl": "...", "mediaType": "video" }

GET /questions/{id}

Description: Retrieves a single question thread with all its answers.

DELETE /questions/{id}

Description: Deletes a question. (Students can delete their own; Admins can delete any).

ANSWERS

POST /questions/{id}/answers

Description: Post a reply to a question (Teacher only).

Payload: { "mediaUrl": "...", "textResponse": "Optional text..." }

PUT /answers/{id}

Description: Edit an existing answer (Teacher can edit own; Admin can edit any).

DELETE /answers/{id}

Description: Delete an answer (Teacher can delete own; Admin can delete any).

ADMINISTRATION

GET /admin/stats

Description: View system metrics (total users, total posts, storage usage).

POST /admin/moderation

Description: Flag or remove content manually.

Payload: { "targetType": "question|answer", "targetId": "...", "action": "remove" }