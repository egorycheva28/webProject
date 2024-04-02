import numpy as np


def load_mnist_images(filename):
    with open(filename, "rb") as f:
        # пропускаем магическое число и количество изображений
        f.read(4)
        num_images = int.from_bytes(f.read(4), "big")
        rows = int.from_bytes(f.read(4), "big")
        cols = int.from_bytes(f.read(4), "big")

        # считываем пиксели
        images = np.frombuffer(f.read(), dtype=np.uint8)
        images = images.reshape((num_images, rows * cols))
        return images / 255  # Нормализация


def load_mnist_labels(filename):
    with open(filename, "rb") as f:
        # пропускаем магическое число и количество меток
        f.read(4)

        # считываем метки
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
        input_layer_neurons_number,
        hidden_layer_neurons_number,
        output_layer_neurons_number,
    ):
        self.inputLayerNeuronsNumber = input_layer_neurons_number

        self.hiddenLayerNeuronsNumber = hidden_layer_neurons_number

        self.outputLayerNeuronsNumber = output_layer_neurons_number

        self.learning_rate = 0.1

        self.hidden_weights = np.random.randn(
            hidden_layer_neurons_number, input_layer_neurons_number
        ) * np.sqrt(2 / input_layer_neurons_number)

        self.hidden_bias = np.zeros([hidden_layer_neurons_number, 1])

        self.output_weights = np.random.randn(
            output_layer_neurons_number, hidden_layer_neurons_number
        )

        self.output_bias = np.zeros([output_layer_neurons_number, 1])

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


images_path = "/Users/bdvzt/Desktop/untitled/train-images-idx3-ubyte"
labels_path = "/Users/bdvzt/Desktop/untitled/train-labels-idx1-ubyte"

X = load_mnist_images(images_path)
y = load_mnist_labels(labels_path)


# Spliting dataset
num_train = 50000
num_test = 10000

X_train = X[:num_train, :]
y_train = np.zeros((num_train, 10))
y_train[np.arange(num_train), y[:num_train]] = 1

X_test = X[num_train:, :]
y_test = np.zeros((num_test, 10))
y_test[np.arange(num_test), y[y.size - num_test :]] = 1


print("Training set shape : ", X_train.shape)
print("Test set shape : ", X_test.shape)

nn = NeuralNetwork(784, 350, 10)


for i in range(X_train.shape[0]):
    inputs = np.array(
        X_train[i, :].reshape(-1, 1)
    )  # преобразование в одномерный массив из одного столбца
    desired_output = np.array(
        y_train[i, :].reshape(-1, 1)
    )  # преобразование в одномерный массив из одного столбца
    nn.train(inputs, desired_output)

prediction_list = []

for i in range(X_test.shape[0]):
    inputs = np.array(
        X_test[i].reshape(-1, 1)
    )  # преобразование в одномерный массив из одного столбца
    prediction_list.append(nn.predict(inputs))

correct_counter = 0

for i in range(len(prediction_list)):
    #возвращаем индексы элементов массива prediction_list[i], удовлетворяющих условию равенства элементов максимальному значению этого массива
    out_index = np.where(prediction_list[i] == np.amax(prediction_list[i]))[0][0]

    if y_test[i][out_index] == 1:
        correct_counter += 1

accuracy = correct_counter / num_test

print("Accuracy is : ", accuracy * 100, " %")
