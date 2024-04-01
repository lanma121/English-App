import cv2
import numpy as np
import tensorflow as tf
from object_detection import CenterNetHourGlass104Keypoints512x512

# 导入模型和权重
model = CenterNetHourGlass104Keypoints512x512()
model.load_weights('/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model/saved_model.pb')

# 准备图像数据
image = cv2.imread('/Users/tliu1/workspace/English-Learning/image-objects/xxxxx.jpeg')
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image = cv2.resize(image, (512, 512))
image = np.expand_dims(image, axis=0).astype(np.float32) / 255.0

# 进行推理
keypoints = model.predict(image)

# 分析结果
num_keypoints = keypoints.shape[1] // 2
keypoint_coords = keypoints.reshape(-1, num_keypoints, 2)
num_goods = len(keypoint_coords[0])

print("检测到的货物数量：", num_goods)
