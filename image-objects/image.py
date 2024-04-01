import numpy as np
import tensorflow as tf
import cv2

# Load the pre-trained model
model_path = '/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model'
model = tf.saved_model.load(model_path)

# Load the label map
label_map_path = 'path/to/label_map.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(label_map_path, use_display_name=True)

# Preprocess the input image
image_path = './apple.jpeg'
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image_tensor = tf.convert_to_tensor(image_rgb)
image_tensor = tf.expand_dims(image_tensor, 0)

# Run inference
detections = model(image_tensor)

# Process the detection results
num_goods = 0
for i in range(detections['num_detections'][0]):
    class_id = int(detections['detection_classes'][0][i])
    if class_id in category_index.keys():
        class_name = category_index[class_id]['name']
        if class_name == 'goods':
            num_goods += 1

# Display the result
print(f"Number of goods: {num_goods}")
