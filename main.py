import os
from flask import Flask, jsonify, request
import numpy as np
from cv2 import imdecode, IMREAD_COLOR
import base64


# import custom module
from model import MNISTModel

app = Flask(__name__)

try:
    model_path = os.path.join("model", "mnist_cnn_model.h5")
    mnist_model = MNISTModel(model_path)
    print(mnist_model)
except Exception as e:
    print(f"[ERROR] {e}")


@app.route('/hello', methods=['GET', 'POST'])
def welcome():
    response = jsonify({"get": "Hello, world!"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/upload", methods=["POST"])
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
    app.run(debug=False)
