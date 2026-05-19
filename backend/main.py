from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import os

from backend.sign_to_text_api import process_video
from backend.ws_sign_to_text import SignToTextWSManager
from backend.text_to_sign_api import generate_sign_video
from backend.animation_mapper import get_animation_sequence

app = FastAPI()   # ✅ لازم قبل أي @app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/sign-to-text")
async def sign_to_text_api(file: UploadFile = File(...)):

    os.makedirs("temp", exist_ok=True)
    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = process_video(file_path)

    return {"translated_text": text}

os.makedirs("outputs", exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

class TextToSignRequest(BaseModel):
    text: str

@app.post("/text-to-sign")
async def text_to_sign_endpoint(request: TextToSignRequest):
    filename = generate_sign_video(request.text)
    return {"video_url": f"/outputs/{filename}"}

@app.post("/text-to-sign-3d")
async def text_to_sign_3d_endpoint(request: TextToSignRequest):
    sequence = get_animation_sequence(request.text)
    return {"animation_sequence": sequence}

@app.websocket("/ws/sign-to-text")
async def websocket_sign_to_text(websocket: WebSocket):
    await websocket.accept()
    print("WS Connected!")
    manager = SignToTextWSManager()
    try:
        while True:
            data = await websocket.receive_text()
            # print("Received frame data of length:", len(data))
            try:
                letter = manager.process_frame(data)
                if letter:
                    await websocket.send_json({"letter": letter})
            except Exception as e:
                import traceback
                print("Error in process_frame:")
                traceback.print_exc()
                # Send error to frontend so user knows
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        print("🔌 Client disconnected from Sign-to-Text WS")
    except Exception as e:
        print(f"❌ WebSocket Loop Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if hasattr(manager, 'close'):
            manager.close()