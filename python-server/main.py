from PIL import Image

import flask
from flask import Flask, send_file
from flask import json
from flask_cors import CORS, cross_origin
from handwritten_converter import get_handwritten_text, change_background
from prediction import predict_text_from_image
from spellcheking import check_spelling

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        image_file = flask.request.files.get('inputFile', '')
        img = Image.open(image_file)

        img.save('input_image.png')
        recognized_text, words_as_str, height, width, boxes_coordinates = predict_text_from_image(img)

        suggestion = check_spelling(words_as_str)

        result = {
            "text": recognized_text,
            "suggested": suggestion,
            "imageHeight": height,
            "imageWidth": width,
            "wordBoxes": boxes_coordinates
        }
        response = app.response_class(
            response=json.dumps(result),
            status=200,
            mimetype='application/json'
        )

        return response
    except Exception as err:
        print("An exception occurred")

    return {"errorMessage": "Something went wrong"}


@app.route('/generate/<back_num>', methods=['POST'])
@cross_origin(supports_credentials=True)
def generate_image(back_num):
    try:
        text_message = flask.request.get_json()
        text_to_image = text_message['message']
        get_handwritten_text(text_to_image)
        change_background(int(back_num))

        return send_file('generated.png', mimetype='image/gif')

    except Exception as err:
        print("An exception occurred")

    return {"errorMessage": "Something went wrong"}


if __name__ == '__main__':
    app.run()
