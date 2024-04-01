import tensorflow as tf
import cv2
import numpy as np

# Load the model
model_path = '/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model/'
model = tf.saved_model.load(model_path)

# Preprocess the input image
image_path = '/Users/tliu1/workspace/English-Learning/image-objects/xxxxx.jpeg'
image = cv2.imread(image_path)

image = cv2.resize(image, (512, 512))
# # 执行适当的图像预处理和归一化
# image = preprocess_image(image)
# image = np.expand_dims(image, axis=0)  # 添加批次维度
image = np.expand_dims(image, axis=0).astype(np.float32) / 255.0

# Run inference
# outputs = model(image)  

# Run inference
input_tensor = tf.convert_to_tensor(image, dtype=tf.float32)
# converted_tensor = tf.cast(input_tensor, tf.uint8)
# outputs = model.signatures['serving_default'](input_tensor)

# Print the model's signature
# print(model.signatures)

# Print the output tensor names
print('-----------------');
print(model.signatures['serving_default'].structured_outputs)

# Extract the keypoints and objectness scores
# keypoints = outputs['output_0']
# objectness_scores = outputs['output_1']

# num_keypoints = keypoints.shape[1]
# print(f"Number of keypoints: {num_keypoints}")

# Threshold objectness scores to filter out weak detections
# threshold = 0.5
# detected_keypoints = keypoints[objectness_scores > threshold]
# num_goods = len(detected_keypoints)

# Display the result
# print(f"Number of goods: {num_goods}")
