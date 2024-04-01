import tensorflow as tf
import tensorflow_hub as hub
import cv2
import numpy as np

# Load the model
model_path = '/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model/'
# model = tf.saved_model.load(model_path)
model = hub.load(model_path)


# Preprocess the input image
image_path = '/Users/tliu1/workspace/English-Learning/image-objects/R.jpg'
image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image = cv2.resize(image, (512, 512))
# # 执行适当的图像预处理和归一化
# image = preprocess_image(image)
# image = np.expand_dims(image, axis=0)  # 添加批次维度
image = np.expand_dims(image, axis=0).astype(np.float32) / 255.0

# Run inference
outputs = model(image)  

# Run inference
# input_tensor = tf.convert_to_tensor(image, dtype=tf.uint8)
# converted_tensor = tf.cast(input_tensor, tf.uint8)
# outputs = model.signatures['serving_default'](input_tensor)

# Print the model's signature
# print(model.signatures)

# Print the output tensor names
print(outputs);
print('-----------------');
# print(model.signatures['serving_default'])


# Extract the keypoints and objectness scores
keypoints = outputs['detection_keypoints']
objectness_scores = outputs['detection_keypoint_scores']
# apple_keypoints = keypoints.numpy()[..., 3]
num_keypoints = keypoints.shape[1]

# num_apples = len(np.where(apple_keypoints > 0.5)[0])
# print(f"Number of apples: {num_apples}")


# Extract the class labels and scores
class_labels = outputs['detection_classes'][0].numpy().astype(int)
scores = outputs['detection_scores'][0].numpy()
print(f"Number of apples: {scores}")
print(f"Number of keypoints: {class_labels}")

num_apples = 0
for i in range(len(class_labels)):
    # print(f"Number of class_labels[i]: {class_labels[i]}")
    print(f"Number of class_labels[i]: {i}")


    if class_labels[i] == 1 and scores[i] > 0.5:
        num_apples += 1


# Threshold objectness scores to filter out weak detections
threshold = 0.5
detected_keypoints = keypoints[objectness_scores > threshold]
num_goods = len(detected_keypoints)

# Display the result
print(f"Number of goods: {num_apples}")
