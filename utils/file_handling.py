from flask import jsonify, Response
import os
import json

def stream_file(file_path, chunk_size=1024):
    """Stream large files with proper error handling"""
    def generate():
        try:
            with open(file_path, 'rb') as f:
                while True:
                    data = f.read(chunk_size)
                    if not data:
                        break
                    yield data
        except Exception as e:
            yield json.dumps({'error': str(e)}).encode()
    
    return Response(generate(), content_type='application/json')

def handle_file_upload(request):
    """Handle dataset upload with validation"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        filename = file.filename
        file_path = os.path.join('data', filename)
        file.save(file_path)
        return jsonify({"message": f"File {filename} uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500