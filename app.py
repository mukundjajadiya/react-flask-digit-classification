import os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
from cv2 import imdecode, IMREAD_COLOR
import base64


# import custom module
from model import MNISTModel

app = Flask(__name__, static_folder="./frontend/build", static_url_path="/")
CORS(app)
try:
    model_path = os.path.join("model", "mnist_cnn_model.h5")
    mnist_model = MNISTModel(model_path)
    print(mnist_model)
except Exception as e:
    print(f"[ERROR] {e}")

@app.route("/", methods=["GET"])
@cross_origin()
def index():
    return app.send_static_file("index.html")

@app.route('/hello', methods=['GET', 'POST'])
@cross_origin()
def welcome():
    if request.method == "GET":
        response = jsonify({"get": "Hello, world!"})
    if request.method == "POST":
        response = jsonify({"post": "Hello, world!"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    global mnist_model

    try:
        msg = {"msg": "Image uploaded successfully"}

        img_bytes = base64.b64decode(str(request.form.get('file')[22:]))
        nparr = np.fromstring(img_bytes, np.uint8)
        img = imdecode(nparr, IMREAD_COLOR)
        prediction = mnist_model.predict(img)

        msg["prediction"] = str(prediction)
        response = jsonify(msg)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    except Exception as e:
        print(f"[ERROR] {e}")

        return jsonify({"error": f"{e}"})


if __name__ == '__main__':
    app.run(host="0.0.0.0")
