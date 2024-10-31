from flask import jsonify, Response
import os

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

def handle_upload(request):
    """Handle dataset upload with validation"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            filename = file.filename
            file_path = os.path.join('data', filename)
            file.save(file_path)
            
            is_valid, error_msg = validate_data_file(
                file_path, 
                'geojson' if filename.endswith('.geojson') else 'csv'
            )
            
            if not is_valid:
                os.remove(file_path)
                return jsonify({"error": f"Invalid file: {error_msg}"}), 400
                
            return jsonify({"message": f"File {filename} uploaded and validated successfully"}), 200
        except Exception as e:
            return jsonify({"error": f"Upload failed: {str(e)}"}), 500