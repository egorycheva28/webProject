import numpy as np


def load_mnist_images(filename):
    with open(filename, "rb") as f:
        # Пропускаем магическое число и количество изображений
        f.read(4)
        num_images = int.from_bytes(f.read(4), 'big')
        rows = int.from_bytes(f.read(4), 'big')
        cols = int.from_bytes(f.read(4), 'big')
        
        # Считываем пиксели
        images = np.frombuffer(f.read(), dtype=np.uint8)
        images = images.reshape((num_images, rows * cols))
        return images / 255  # Нормализация

def load_mnist_labels(filename):
    with open(filename, "rb") as f:
        # Пропускаем магическое число и количество меток
        f.read(4)
        # num_labels = int.from_bytes(f.read(4), 'big')
        
        # Считываем метки
        labels = np.frombuffer(f.read(), dtype=np.uint8)
        return labels


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


def sigmoid_derivative(x):
    return x * (1 - x)


def loss(predicted_output, desired_output):
    return 1 / 2 * (desired_output - predicted_output) ** 2


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
        # He initialization
        self.hidden_weights = np.random.randn(
            hiddenLayerNeuronsNumber, inputLayerNeuronsNumber
        ) * np.sqrt(2 / inputLayerNeuronsNumber)
        self.hidden_bias = np.zeros([hiddenLayerNeuronsNumber, 1])
        self.output_weights = np.random.randn(
            outputLayerNeuronsNumber, hiddenLayerNeuronsNumber
        )
        self.output_bias = np.zeros([outputLayerNeuronsNumber, 1])
        self.loss = []

    def train(self, inputs, desired_output):
        hidden_layer_in = np.dot(self.hidden_weights, inputs) + self.hidden_bias
        hidden_layer_out = sigmoid(hidden_layer_in)

        output_layer_in = (
            np.dot(self.output_weights, hidden_layer_out) + self.output_bias
        )
        predicted_output = sigmoid(output_layer_in)

        error = desired_output - predicted_output
        d_predicted_output = error * sigmoid_derivative(predicted_output)

        error_hidden_layer = d_predicted_output.T.dot(self.output_weights)
        d_hidden_layer = error_hidden_layer.T * sigmoid_derivative(hidden_layer_out)

        self.output_weights += (
            hidden_layer_out.dot(d_predicted_output.T).T * self.learning_rate
        )
        self.output_bias += (
            np.sum(d_predicted_output, axis=0, keepdims=True) * self.learning_rate
        )

        self.hidden_weights += inputs.dot(d_hidden_layer.T).T * self.learning_rate
        self.hidden_bias += (
            np.sum(d_hidden_layer, axis=0, keepdims=True) * self.learning_rate
        )
        self.loss.append(loss(predicted_output, desired_output))

    def predict(self, inputs):
        hidden_layer_in = np.dot(self.hidden_weights, inputs) + self.hidden_bias
        hidden_layer_out = sigmoid(hidden_layer_in)
        output_layer_in = (
            np.dot(self.output_weights, hidden_layer_out) + self.output_bias
        )
        predicted_output = sigmoid(output_layer_in)
        return predicted_output

images_path = "/Users/bdvzt/Desktop/WEB_PROJECT/webProject/Neural_NetWork/train-images-idx3-ubyte"
labels_path = "/Users/bdvzt/Desktop/WEB_PROJECT/webProject/Neural_NetWork/train-labels-idx1-ubyte"

X = load_mnist_images(images_path)
y = load_mnist_labels(labels_path)

# Продолжаем с вашим кодом по разделению и предобработке данных
num_train = 50000
num_test = 10000

X_train = X[:num_train, :]
y_train = np.zeros((num_train, 10))
y_train[np.arange(num_train), y[:num_train]] = 1

X_test = X[num_train:, :]
y_test = np.zeros((num_test, 10))
y_test[np.arange(num_test), y[-num_test:]] = 1


nn = NeuralNetwork(784, 350, 10)

for i in range(X_train.shape[0]):
    inputs = np.array(X_train[i, :].reshape(-1, 1))
    desired_output = np.array(y_train[i, :].reshape(-1, 1))
    nn.train(inputs, desired_output)


prediction_list = []
for i in range(X_test.shape[0]):
    inputs = np.array(X_test[i].reshape(-1, 1))
    prediction_list.append(nn.predict(inputs))

correct_counter = 0
for i in range(len(prediction_list)):
    out_index = np.where(prediction_list[i] == np.amax(prediction_list[i]))[0][0]

    if y_test[i][out_index] == 1:
        correct_counter += 1

accuracy = correct_counter / num_test

print("Accuracy is : ", accuracy * 100, " %")
