from PIL import Image

import flask
from flask import Flask, jsonify, send_file
from flask import json
from flask_cors import CORS, cross_origin
from handwritten_converter import get_handwritten_text

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route('/')
def login():
    return "Hello, World!"


@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        image_file = flask.request.files.get('inputFile', '')
        img = Image.open(image_file)
        img = img.convert('L')  # convert to greyscale
        img.save('output.png')

        d = {"text": "Recognized text from python server"}

        response = app.response_class(
            response=json.dumps(d),
            status=200,
            mimetype='application/json'
        )

        return response
    except Exception as err:
        print("An exception occurred")

    return {"errorMessage": "Something went wrong"}


@app.route('/generate', methods=['POST'])
@cross_origin(supports_credentials=True)
def generate_image():
    try:
        text_message = flask.request.get_json()
        text_to_image = text_message['message']
        get_handwritten_text(text_to_image)

        return send_file('generated.png', mimetype='image/gif')

    except Exception as err:
        print("An exception occurred")

    return {"errorMessage": "Something went wrong"}

if __name__ == '__main__':
    app.run()
