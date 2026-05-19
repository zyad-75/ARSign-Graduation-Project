import asyncio
import websockets
import base64
import sys

async def test_ws():
    uri = "ws://127.0.0.1:8000/ws/sign-to-text"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected! Sending dummy frame...")
            
            # Send an invalid base64 first to see how server handles it
            await websocket.send("data:image/jpeg;base64,invalid_data===")
            
            # Try receiving
            try:
                res = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                print(f"Received: {res}")
            except asyncio.TimeoutError:
                print("No response from server (expected for invalid img)")
            
            print("Test complete and connection was stable.")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ws())
