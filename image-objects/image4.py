import cv2
import numpy as np
import tensorflow as tf

model_path = '/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model'


# 加载模型
model = tf.keras.models.load_model(model_path)

# 读取图像
image = cv2.imread('./R.jpg')
# image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image = cv2.resize(image, (512, 512))
image = np.expand_dims(image, axis=0).astype(np.float32) / 255.0

# 进行关键点检测
keypoints = model.predict(image)

# 解析关键点结果
# 假设每个关键点有两个坐标（x, y）
num_keypoints = keypoints.shape[1] // 2
keypoint_coords = keypoints.reshape(-1, num_keypoints, 2)

# 显示关键点结果
image = cv2.cvtColor(image[0], cv2.COLOR_RGB2BGR)
for keypoint in keypoint_coords[0]:
    x, y = keypoint
    cv2.circle(image, (int(x), int(y)), 2, (0, 255, 0), -1)

cv2.imshow('KeyPoints Detection', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
