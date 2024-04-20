import json  # https://medium.com/@akhmisy/build-a-neural-network-for-handwritten-digits-recognition-from-scratch-using-python-2244f6b9e494
from PIL import Image
import math
import random


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def sigmoid_derivative(x):
    return x * (1 - x)


def loss(predicted_output, desired_output):
    return sum(
        0.5 * (d_o - p_o) ** 2 for d_o, p_o in zip(desired_output, predicted_output)
    ) / len(desired_output)


def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))


def matrix_multiply(matrix, vector):
    return [dot_product(row, vector) for row in matrix]


def matrix_add(v1, v2):
    return [x + y for x, y in zip(v1, v2)]


def vector_scalar_multiply(vector, scalar):
    return [x * scalar for x in vector]


def transpose(matrix):
    return list(map(list, zip(*matrix)))


def resize_image_with_pil(image_data, new_width=50, new_height=50):
    image = Image.new(
        "L", (len(image_data[0]), len(image_data)), 255
    )  # cоздание черно-белого изображения
    for y, row in enumerate(image_data):
        for x, value in enumerate(row):
            image.putpixel((x, y), int(value * 255))  # установка значения пикселя

    resized_image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # преобразование обратно в нормализованный список пикселей
    resized_image_data = [
        [resized_image.getpixel((x, y)) / 255.0 for x in range(new_width)]
        for y in range(new_height)
    ]

    return resized_image_data


def load_mnist_images(filename):
    with open(filename, "rb") as f:
        f.read(4)  # магическое число
        num_images = int.from_bytes(f.read(4), "big")
        rows = int.from_bytes(f.read(4), "big")
        cols = int.from_bytes(f.read(4), "big")

        # чтение данных изображения
        data = f.read()
        images = []
        for i in range(num_images):
            image = []
            for r in range(rows):
                row = []
                for c in range(cols):
                    # вычисление индекса начала пикселя
                    index = i * rows * cols + r * cols + c
                    pixel = data[index]
                    row.append(pixel / 255.0)
                image.append(row)
            images.append(image)

        # изменение размера каждого изображения
        resized_images = [resize_image_with_pil(img) for img in images]

        return resized_images


def load_mnist_labels(filename):
    with open(filename, "rb") as f:
        f.read(4)  # пропускаем магическое число
        num_labels = int.from_bytes(f.read(4), "big")  # количество меток

        # оставшиеся байты файла - метки
        data = f.read()
        labels = [data[i] for i in range(num_labels)]  # байт в целое число
        return labels


images_path = "/Users/bdvzt/Desktop/untitled/train-images-idx3-ubyte"
labels_path = "/Users/bdvzt/Desktop/untitled/train-labels-idx1-ubyte"

X = load_mnist_images(images_path)
y = load_mnist_labels(labels_path)

num_train = 50000
num_test = 10000

X_train = X[:num_train]
y_train = []

for i in range(num_train):
    y_row = [0] * 10
    y_row[y[i]] = 1
    y_train.append(y_row)

X_test = X[-num_test:]
y_test = []

for i in range(num_test):
    y_row = [0] * 10
    y_row[y[-num_test + i]] = 1
    y_test.append(y_row)


class NeuralNetwork:
    def __init__(
        self,
        inputLayerNeuronsNumber,
        hiddenLayerNeuronsNumber,
        outputLayerNeuronsNumber,
    ):
        self.inputLayerNeuronsNumber = inputLayerNeuronsNumber
        self.hiddenLayerNeuronsNumber = hiddenLayerNeuronsNumber
        self.outputLayerNeuronsNumber = outputLayerNeuronsNumber

        self.learning_rate = 0.1

        self.hidden_weights = [
            [
                random.gauss(0, math.sqrt(2 / inputLayerNeuronsNumber))
                for _ in range(inputLayerNeuronsNumber)
            ]
            for _ in range(hiddenLayerNeuronsNumber)
        ]
        self.hidden_bias = [0] * hiddenLayerNeuronsNumber
        self.output_weights = [
            [random.gauss(0, 1) for _ in range(hiddenLayerNeuronsNumber)]
            for _ in range(outputLayerNeuronsNumber)
        ]
        self.output_bias = [0] * outputLayerNeuronsNumber
        self.loss = []

    def train(self, inputs, desired_output):
        hidden_layer_in = matrix_add(
            matrix_multiply(self.hidden_weights, inputs), self.hidden_bias
        )
        hidden_layer_out = list(map(sigmoid, hidden_layer_in))

        output_layer_in = matrix_add(
            matrix_multiply(self.output_weights, hidden_layer_out),
            self.output_bias,
        )
        predicted_output = list(map(sigmoid, output_layer_in))

        error = [d_o - p_o for d_o, p_o in zip(desired_output, predicted_output)]

        d_predicted_output = [
            e * sigmoid_derivative(p) for e, p in zip(error, predicted_output)
        ]

        error_hidden_layer = matrix_multiply(
            transpose(self.output_weights), d_predicted_output
        )
        d_hidden_layer = [
            e * sigmoid_derivative(h)
            for e, h in zip(error_hidden_layer, hidden_layer_out)
        ]

        self.output_weights = [
            matrix_add(ow, vector_scalar_multiply(vector, self.learning_rate))
            for ow, vector in zip(
                self.output_weights,
                transpose([d_predicted_output] * self.hiddenLayerNeuronsNumber),
            )
        ]
        self.output_bias = matrix_add(
            self.output_bias,
            vector_scalar_multiply(d_predicted_output, self.learning_rate),
        )

        self.hidden_weights = [
            matrix_add(hw, vector_scalar_multiply(vector, self.learning_rate))
            for hw, vector in zip(
                self.hidden_weights,
                transpose([d_hidden_layer] * self.inputLayerNeuronsNumber),
            )
        ]
        self.hidden_bias = matrix_add(
            self.hidden_bias, vector_scalar_multiply(d_hidden_layer, self.learning_rate)
        )

        self.loss.append(loss(predicted_output, desired_output))

    def predict(self, inputs):
        hidden_layer_in = matrix_add(
            matrix_multiply(self.hidden_weights, inputs), self.hidden_bias
        )
        hidden_layer_out = list(map(sigmoid, hidden_layer_in))
        output_layer_in = matrix_add(
            matrix_multiply(self.output_weights, hidden_layer_out), self.output_bias
        )
        predicted_output = list(map(sigmoid, output_layer_in))
        return predicted_output


nn = NeuralNetwork(2500, 250, 10)

for i in range(len(X_train)):
    inputs = [[x] for x in X_train[i]]  
    desired_output = [[y] for y in y_train[i]]
    nn.train(inputs, desired_output)

prediction_list = []
for i in range(len(X_test)):
    inputs = [[x] for x in X_test[i]]
    prediction_list.append(nn.predict(inputs))

correct_counter = 0

for i in range(len(prediction_list)):
    out_index = max(range(len(prediction_list[i])), key=lambda x: prediction_list[i][x])
    
    if y_test[i][out_index] == 1:
        correct_counter += 1

print(f"Accuracy: {correct_counter / len(y_test) * 100}%")


weights = {
    "hidden_weights": nn.hidden_weights.tolist(),
    "hidden_bias": nn.hidden_bias.tolist(),
    "output_weights": nn.output_weights.tolist(),
    "output_bias": nn.output_bias.tolist(),
}

with open("new_weights50x50_250tru.json", "w") as file:
    json.dump(weights, file)
