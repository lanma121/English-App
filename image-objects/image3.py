import tensorflow as tf
import cv2

# Load the pre-trained model
model_path = 'path/to/saved_model'
model = tf.saved_model.load(model_path)

# Preprocess the input image
image_path = 'path/to/input/image.jpg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image_tensor = tf.convert_to_tensor(image_rgb)
image_tensor = tf.expand_dims(image_tensor, 0)

# Run inference
detections = model(image_tensor)

# Extract the bounding boxes, class labels, and scores
boxes = detections['detection_boxes'][0].numpy()
class_labels = detections['detection_classes'][0].numpy().astype(int)
scores = detections['detection_scores'][0].numpy()

# Count the number of goods
num_goods = 0
for i in range(len(boxes)):
    if class_labels[i] == <goods_class_label> and scores[i] > <confidence_threshold>:
        num_goods += 1

# Display the result
print(f"Number of goods: {num_goods}")
