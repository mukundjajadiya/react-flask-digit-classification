from cv2 import cvtColor, resize, COLOR_BGR2GRAY, INTER_AREA
from keras.models import load_model
from numpy import expand_dims, argmax, asarray

print("\nLoading Library..")
print("\nLibrary Loaded successfully")


class MNISTModel():
    def __init__(self, model_path):
        self.model = self.load_mnist_model(model_path)

    def img_preprocess(self, img):
        try:
            dim = (28, 28)
            img = asarray(img)
            img = cvtColor(img, COLOR_BGR2GRAY)
            img = resize(img, dim, interpolation=INTER_AREA)
            img = expand_dims(img, axis=2)
            img = expand_dims(img, axis=0)
            return img

        except Exception as e:
            print(f"[ERROR] {e}")

    def load_mnist_model(self, model_path):
        try:
            print("\nmodel Loading.....")
            model = load_model(model_path)
            print("\nmodel Loaded successfully")
            return model

        except Exception as e:
            print(f"[ERROR] {e}")

    def predict(self, img):
        print("\nPredicting...")
        img = self.img_preprocess(img)
        predictions = argmax(self.model.predict(img))
        print(f"\nclassified as {predictions}")
        return predictions
