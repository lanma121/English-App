import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import PIL.Image as Image

model_path = '/Users/tliu1/Downloads/centernet_hg104_512x512_kpts_coco17_tpu-32/saved_model/'


# 加载图像分类模型
# model = hub.KerasLayer("https://tfhub.dev/google/nnlm-en-dim128/2")
model = hub.KerasLayer(model_path)
# model = hub.load("https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/4")

# 加载图像并进行预处理
image = Image.open('/Users/tliu1/workspace/English-Learning/image-objects/xxxxx.jpeg')
image = np.array(image.resize((224, 224))) / 255.0
image = np.expand_dims(image, axis=0)

# 进行图像分类
predictions = model(image)
predicted_labels = np.argmax(predictions, axis=-1)

# 输出预测结果
print("Predicted label:", predicted_labels)
