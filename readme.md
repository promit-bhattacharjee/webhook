# AI Text Processing & Analysis Workflow

A lightweight full-stack automation system that accepts user input from a web interface, sends it through a FastAPI backend, and triggers an n8n workflow for AI-powered summarization and key point extraction. Results are stored in Google Sheets and emailed to the user automatically.

---

# 🏗️ Architecture

```text
Frontend (HTML/JS)
        ↓
FastAPI Backend
        ↓
n8n Workflow
   ├── AI Summarization
   ├── Key Point Extraction
   ├── Google Sheets Storage
   └── Email Notification
```

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- Bootstrap 5
- Vanilla JavaScript
- Axios

## Backend
- Python 3.8+
- FastAPI
- Uvicorn
- Pydantic

## Automation
- n8n
- Google Gemini / OpenAI
- Google Sheets API
- Gmail API

---

# 📁 Project Structure

```text
project/
│
├── frontend/
│   ├── index.html
│   ├── index.js
│   └── Dockerfile
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
│
├── workflow.json
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Requirements

- Python 3.8+
- Docker & Docker Compose
- n8n account
- Google API credentials
- Gemini/OpenAI API key

---

# 🚀 Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env`:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/text-reciver-webhook
DEBUG=True
```

Run backend:

```bash
python main.py
```

Backend URL:

```text
http://0.0.0.0:8000
```

---

# 🌐 Frontend Setup

Frontend is served directly using a Docker container.

Frontend URL:

```text
http://172.20.0.3:80
```

---

# 🐳 Docker Setup

## frontend/Dockerfile

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80
```

---

## backend/Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## docker-compose.yml

```yaml
version: '3.8'

services:

  backend:
    build: ./backend
    container_name: ai-backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: ai-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

---

# ▶️ Run with Docker

Build containers:

```bash
docker-compose build
```

Start containers:

```bash
docker-compose up
```

Run in background:

```bash
docker-compose up -d
```

Stop containers:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs
```

---

# 🌍 Service URLs

## Frontend

```text
http://172.20.0.3:80
```

## Backend

```text
http://0.0.0.0:8000
```

## FastAPI Docs

```text
http://0.0.0.0:8000/docs
```

---

# 🔌 API Endpoint

## POST `/analyze`

Request:

```json
{
  "email": "user@example.com",
  "text": "Text or URL",
  "session_id": "id_abc123"
}
```

Response:

```json
{
  "status": "success",
  "message": "Task Completed, Please Check Your Mail"
}
```

---

# 🔄 n8n Workflow

1. Receive webhook request
2. Detect text or URL
3. Extract webpage content
4. Generate AI summary
5. Extract key points
6. Store in Google Sheets
7. Send email notification
8. Return success response

---

# 📊 Google Sheets Format

```text
Date | Email | Session_ID | Summary | Key Point 1 | Key Point 2 | Key Point 3 | Original Text
```

---

# 🔐 Security Notes

- Store secrets in `.env`
- Never expose API keys
- Use HTTPS in production
- Restrict CORS origins
- Enable rate limiting

---

# 🐛 Common Issues

## Backend not starting

```bash
pip install -r requirements.txt
```

## Docker issue

```bash
docker-compose logs
```

## Port already in use

```bash
lsof -i :8000
```

---

# ✨ Features

- AI summarization
- URL scraping
- Google Sheets logging
- Email notifications
- Session management
- Docker deployment

---

# 📚 Useful Links

- FastAPI: https://fastapi.tiangolo.com/
- n8n: https://docs.n8n.io/
- Gemini API: https://ai.google.dev
- Docker: https://www.docker.com/

---

# 🎉 Result

Users can submit text or URLs and automatically receive:

- AI-generated summaries
- Key point extraction
- Email notifications
- Google Sheets storage
