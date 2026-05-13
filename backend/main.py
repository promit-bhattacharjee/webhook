from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    email: str
    text: str
    session_id: str

# PRODUCTION URL: Make sure the workflow is "Active" in n8n!
N8N_WEBHOOK_URL = "https://promitbhattacharjee.app.n8n.cloud/webhook/text-reciver-webhook"

@app.post("/analyze")
async def send_to_n8n(data: AnalysisRequest):
    try:
        # model_dump() is the modern version of .dict()
        payload = data.model_dump()
        response = requests.post(N8N_WEBHOOK_URL, json=payload)
        
        if response.status_code == 200:
            return response.json() 
        else:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"n8n production error: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)