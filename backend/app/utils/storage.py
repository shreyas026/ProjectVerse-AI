import os
import uuid

def save_file_locally(contents: bytes, filename: str, folder: str) -> str:
    """Saves raw file contents locally and returns a static file URL served by FastAPI."""
    # Ensure folder path exists inside the uploads directory
    target_dir = os.path.join("uploads", folder)
    os.makedirs(target_dir, exist_ok=True)
    
    # Generate unique filename to avoid naming collisions
    ext = os.path.splitext(filename)[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    
    filepath = os.path.join(target_dir, unique_name)
    with open(filepath, "wb") as f:
        f.write(contents)
        
    # Return local URL matching the static app mount
    # Default to localhost:8000. Under production, this relative or absolute URL is resolved.
    return f"http://localhost:8000/uploads/{folder}/{unique_name}"
