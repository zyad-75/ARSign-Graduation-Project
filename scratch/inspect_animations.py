import json
import struct

def inspect_glb(file_path):
    with open(file_path, 'rb') as f:
        # Read header
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a GLB file")
            return
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        
        # Read first chunk (JSON)
        chunk_length = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        if chunk_type != b'JSON':
            print("First chunk is not JSON")
            return
        
        json_data = f.read(chunk_length).decode('utf-8')
        data = json.loads(json_data)
        
        if 'animations' in data:
            print(f"Found {len(data['animations'])} animations:")
            for i, anim in enumerate(data['animations']):
                name = anim.get('name', 'unnamed')
                print(f" - Animation {i}: {name.encode('utf-8')}")
        else:
            print("No animations found in JSON header")

if __name__ == "__main__":
    inspect_glb(r'd:\Grad\GraduationProject\frontend\ars-sign\public\assets\avatar.glb')
