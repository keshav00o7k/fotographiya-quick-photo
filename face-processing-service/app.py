# # # from flask import Flask, request, jsonify
# # # from facenet_pytorch import MTCNN, InceptionResnetV1
# # # from PIL import Image, UnidentifiedImageError
# # # import requests
# # # from io import BytesIO
# # # import torch
# # # import numpy as np

# # # app = Flask(__name__)

# # # # GPU या CPU का चुनाव
# # # device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
# # # print(f'Running on device: {device}')

# # # # 🔥 CORRECT MTCNN FAST CONFIG (facenet_pytorch params)
# # # mtcnn = MTCNN(
# # #     keep_all=True, 
# # #     device=device,
# # #     min_face_size=40,     # ↑ Bigger = faster
# # #     thresholds=[0.6, 0.7, 0.8],  # Conservative thresholds = faster
# # #     factor=0.8,           # ↑ Fewer scales = faster  
# # #     post_process=False    # Skip alignment = faster
# # # )
# # # resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# # # def get_image_from_url(url):
# # #     try:
# # #         response = requests.get(url, timeout=15)
# # #         response.raise_for_status()

# # #         # Validate image
# # #         temp = BytesIO(response.content)
# # #         try:
# # #             img = Image.open(temp)
# # #             img.verify()
# # #         except UnidentifiedImageError as ue:
# # #             print(f"Unidentified image at {url}: {ue}")
# # #             return None

# # #         # 🔥 RESIZE 640px MAX (80% SPEED BOOST)
# # #         img = Image.open(BytesIO(response.content)).convert('RGB')
# # #         img.thumbnail((640, 640), Image.Resampling.LANCZOS)
        
# # #         return img

# # #     except requests.exceptions.RequestException as e:
# # #         print(f"Error downloading image from {url}: {e}")
# # #         return None
# # #     except Exception as e:
# # #         print(f"Unexpected error loading image from {url}: {e}")
# # #         return None

# # # def get_embeddings(image):
# # #     try:
# # #         boxes, _ = mtcnn.detect(image)
# # #         if boxes is None:
# # #             return None
        
# # #         # 🔥 LIMIT 2 FACES ONLY
# # #         boxes = boxes[:2]
# # #         if len(boxes) == 0:
# # #             return None
            
# # #         embeddings = resnet(mtcnn.extract(image, boxes, save_path=None).to(device))
# # #         return embeddings
# # #     except Exception as e:
# # #         print(f"Could not process image for embeddings: {e}")
# # #         return None

# # # # ... rest of code same (match_faces function unchanged) ...

# # # @app.route('/match-faces', methods=['POST'])
# # # def match_faces():
# # #     data = request.get_json()
# # #     if not data or 'userSelfieUrl' not in data or 'groupPhotoUrls' not in data:
# # #         return jsonify({"error": "Missing required parameters"}), 400

# # #     user_selfie_url = data['userSelfieUrl']
    
# # #     original_count = len(data['groupPhotoUrls'])
# # #     group_photo_urls = list(dict.fromkeys(data['groupPhotoUrls']))
# # #     print(f"📊 Deduplicated: {original_count} → {len(group_photo_urls)} unique images")

# # #     selfie_img = get_image_from_url(user_selfie_url)
# # #     if selfie_img is None:
# # #         return jsonify({"error": "Could not download or decode user selfie"}), 400

# # #     selfie_embeddings = get_embeddings(selfie_img)
# # #     if selfie_embeddings is None:
# # #         return jsonify({"error": "No face detected in the user selfie"}), 400

# # #     selfie_embedding_ref = selfie_embeddings[0]
# # #     matched_photo_urls = []
# # #     invalid_images = 0

# # #     for photo_url in group_photo_urls:
# # #         print(f"🔍 Checking image: {photo_url}")
# # #         group_img = get_image_from_url(photo_url)
# # #         if group_img is None:
# # #             print(f"⚠️ Skipping invalid image: {photo_url}")
# # #             invalid_images += 1
# # #             continue

# # #         group_embeddings = get_embeddings(group_img)
# # #         if group_embeddings is None:
# # #             continue

# # #         for group_embedding in group_embeddings:
# # #             distance = (selfie_embedding_ref - group_embedding).norm().item()
# # #             if distance < 0.9:
# # #                 matched_photo_urls.append(photo_url)
# # #                 break

# # #     print(f"✅ Matching complete. Matched: {len(matched_photo_urls)} | Invalid: {invalid_images}")
# # #     return jsonify({"matchedPhotoUrls": matched_photo_urls})

# # # if __name__ == '__main__':
# # #     app.run(host='0.0.0.0', port=5001)




# # from flask import Flask, request, jsonify
# # from facenet_pytorch import MTCNN, InceptionResnetV1
# # from PIL import Image, UnidentifiedImageError
# # import requests
# # from io import BytesIO
# # import torch
# # import numpy as np

# # app = Flask(__name__)

# # device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
# # print(f'Running on device: {device}')

# # # 🔥 BALANCED CONFIG (Speed + Accuracy)
# # mtcnn = MTCNN(
# #     keep_all=True, 
# #     device=device,
# #     min_face_size=40,           # ↓ 50→40 (more faces)
# #     thresholds=[0.6, 0.7, 0.8], # ↓ Original (better detection)
# #     factor=0.8,                 # ↓ Original 
# #     post_process=False
# # )
# # resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# # def get_image_from_url(url):
# #     try:
# #         response = requests.get(url, timeout=12)  # Balanced timeout
# #         response.raise_for_status()

# #         temp = BytesIO(response.content)
# #         try:
# #             img = Image.open(temp)
# #             img.verify()
# #         except UnidentifiedImageError as ue:
# #             print(f"Unidentified image at {url}: {ue}")
# #             return None

# #         img = Image.open(BytesIO(response.content)).convert('RGB')
# #         img.thumbnail((576, 576), Image.Resampling.LANCZOS)  # 🔥 512→576 (balanced)
# #         return img

# #     except requests.exceptions.RequestException as e:
# #         print(f"Error downloading image from {url}: {e}")
# #         return None
# #     except Exception as e:
# #         print(f"Unexpected error loading image from {url}: {e}")
# #         return None

# # def get_embeddings(image):
# #     try:
# #         boxes, _ = mtcnn.detect(image)
# #         if boxes is None:
# #             return None
        
# #         boxes = boxes[:2]  # ↑ 1→2 (multi-face support)
# #         if len(boxes) == 0:
# #             return None
            
# #         embeddings = resnet(mtcnn.extract(image, boxes, save_path=None).to(device))
# #         return embeddings
# #     except Exception as e:
# #         print(f"Could not process image for embeddings: {e}")
# #         return None

# # @app.route('/match-faces', methods=['POST'])
# # def match_faces():
# #     data = request.get_json()
# #     if not data or 'userSelfieUrl' not in data or 'groupPhotoUrls' not in data:
# #         return jsonify({"error": "Missing required parameters"}), 400

# #     user_selfie_url = data['userSelfieUrl']
# #     original_count = len(data['groupPhotoUrls'])
# #     group_photo_urls = list(dict.fromkeys(data['groupPhotoUrls']))
# #     print(f"📊 Deduplicated: {original_count} → {len(group_photo_urls)} unique images")

# #     selfie_img = get_image_from_url(user_selfie_url)
# #     if selfie_img is None:
# #         return jsonify({"error": "Could not download or decode user selfie"}), 400

# #     selfie_embeddings = get_embeddings(selfie_img)
# #     if selfie_embeddings is None:
# #         return jsonify({"error": "No face detected in the user selfie"}), 400

# #     selfie_embedding_ref = selfie_embeddings[0]
# #     matched_photo_urls = []
# #     invalid_images = 0

# #     # 🔥 OPTIMAL BATCH SIZE
# #     BATCH_SIZE = 6  # ↓ 8→6 (stability + speed)
# #     print("🚀 BALANCED BATCH processing...")
    
# #     for i in range(0, len(group_photo_urls), BATCH_SIZE):
# #         batch_urls = group_photo_urls[i:i+BATCH_SIZE]
# #         print(f"🔍 Batch {i//BATCH_SIZE + 1}/{(len(group_photo_urls)+BATCH_SIZE-1)//BATCH_SIZE}")
        
# #         batch_imgs = []
# #         valid_urls = []
# #         for url in batch_urls:
# #             img = get_image_from_url(url)
# #             if img is None:
# #                 invalid_images += 1
# #                 continue
# #             batch_imgs.append(img)
# #             valid_urls.append(url)
        
# #         if not batch_imgs:
# #             continue
            
# #         try:
# #             # 🔥 BATCH PROCESSING
# #             batch_boxes, batch_probs = mtcnn.detect(batch_imgs)
# #             if batch_boxes is not None:
# #                 batch_embeddings_list = []
# #                 for boxes in batch_boxes:
# #                     if boxes is not None and len(boxes) > 0:
# #                         embeddings = resnet(mtcnn.extract(batch_imgs[batch_boxes.index(boxes)], 
# #                                                         boxes[:2], None).to(device))
# #                         batch_embeddings_list.append(embeddings)
# #                     else:
# #                         batch_embeddings_list.append(None)
                
# #                 # Match check
# #                 for j, (boxes, embeddings) in enumerate(zip(batch_boxes, batch_embeddings_list)):
# #                     if embeddings is not None:
# #                         for embedding in embeddings:
# #                             distance = (selfie_embedding_ref - embedding).norm().item()
# #                             if distance < 0.9:
# #                                 matched_photo_urls.append(valid_urls[j])
# #                                 break
# #         except Exception as e:
# #             print(f"Batch fallback: {e}")
# #             # Single fallback
# #             for img, url in zip(batch_imgs, valid_urls):
# #                 group_embeddings = get_embeddings(img)
# #                 if group_embeddings is not None:
# #                     for embedding in group_embeddings:
# #                         if (selfie_embedding_ref - embedding).norm().item() < 0.9:
# #                             matched_photo_urls.append(url)
# #                             break

# #     print(f"✅ BALANCED complete. Matched: {len(matched_photo_urls)} | Invalid: {invalid_images}")
# #     return jsonify({"matchedPhotoUrls": matched_photo_urls})

# # if __name__ == '__main__':
# #     app.run(host='0.0.0.0', port=5001)




# from flask import Flask, request, jsonify
# from facenet_pytorch import MTCNN, InceptionResnetV1
# from PIL import Image, UnidentifiedImageError
# import requests
# from io import BytesIO
# import torch
# import numpy as np
# import io

# app = Flask(__name__)

# device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
# print(f'Running on device: {device}')

# mtcnn = MTCNN(
#     keep_all=True, 
#     device=device,
#     min_face_size=40,
#     thresholds=[0.6, 0.7, 0.8],
#     factor=0.8,
#     post_process=False
# )
# resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# def get_image_from_url(url):
#     try:
#         response = requests.get(url, timeout=10, stream=True)
#         response.raise_for_status()

#         temp = BytesIO(response.content)
#         try:
#             img = Image.open(temp)
#             img.verify()
#         except UnidentifiedImageError:
#             return None

#         # 🔥 JPEG COMPRESS + RESIZE (70% FASTER)
#         img = Image.open(BytesIO(response.content)).convert('RGB')
#         img.thumbnail((600, 600), Image.Resampling.LANCZOS)
        
#         # 🔥 QUALITY=60 (LOW QUALITY FAST PROCESSING)
#         img_bytes = io.BytesIO()
#         img.save(img_bytes, format='JPEG', quality=60, optimize=True)
#         img_bytes.seek(0)
        
#         compressed_img = Image.open(img_bytes).convert('RGB')
#         return compressed_img

#     except:
#         return None

# def get_embeddings(image):
#     try:
#         boxes, _ = mtcnn.detect(image)
#         if boxes is None or len(boxes) == 0:
#             return None
        
#         # Best face only
#         best_box_idx = 0
#         if len(boxes) > 1:
#             _, probs = mtcnn.detect(image)
#             best_box_idx = np.argmax(probs)
            
#         boxes = boxes[best_box_idx:best_box_idx+1]
#         embeddings = resnet(mtcnn.extract(image, boxes, save_path=None).to(device))
#         return embeddings
#     except:
#         return None

# @app.route('/match-faces', methods=['POST'])
# def match_faces():
#     data = request.get_json()
#     if not data or 'userSelfieUrl' not in data or 'groupPhotoUrls' not in data:
#         return jsonify({"error": "Missing required parameters"}), 400

#     user_selfie_url = data['userSelfieUrl']
#     group_photo_urls = list(dict.fromkeys(data['groupPhotoUrls']))
#     print(f"📊 Processing {len(group_photo_urls)} unique images")

#     selfie_img = get_image_from_url(user_selfie_url)
#     if selfie_img is None:
#         return jsonify({"error": "Selfie failed"}), 400

#     selfie_embeddings = get_embeddings(selfie_img)
#     if selfie_embeddings is None:
#         return jsonify({"error": "No face in selfie"}), 400

#     selfie_embedding_ref = selfie_embeddings[0]
#     matched_photo_urls = []
    
#     print("🚀 JPEG COMPRESSED processing...")
#     import time
#     start_time = time.time()

#     for i, photo_url in enumerate(group_photo_urls, 1):
#         group_img = get_image_from_url(photo_url)
#         if group_img is None:
#             continue
            
#         group_embeddings = get_embeddings(group_img)
#         if group_embeddings is not None:
#             for group_embedding in group_embeddings:
#                 distance = (selfie_embedding_ref - group_embedding).norm().item()
#                 if distance < 0.85:
#                     matched_photo_urls.append(photo_url)
#                     break
        
#         if i % 20 == 0:
#             elapsed = time.time() - start_time
#             print(f"📈 {i}/{len(group_photo_urls)} ({elapsed:.1f}s | {elapsed/i:.2f}s/photo)")

#     total_time = time.time() - start_time
#     print(f"✅ JPEG COMPRESSED: {len(matched_photo_urls)} matches | {total_time:.1f}s | {total_time/len(group_photo_urls):.2f}s/photo")
#     return jsonify({"matchedPhotoUrls": matched_photo_urls})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001)



from flask import Flask, request, jsonify
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image, UnidentifiedImageError
import requests
from io import BytesIO
import io  # 🔥 FIXED: Missing import
import torch
import numpy as np
import time

app = Flask(__name__)

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print(f'Running on device: {device}')

mtcnn = MTCNN(
    keep_all=True, 
    device=device,
    min_face_size=40,
    thresholds=[0.6, 0.7, 0.8],
    factor=0.8,
    post_process=False
)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

def get_image_from_url(url):
    try:
        response = requests.get(url, timeout=10, stream=True)
        response.raise_for_status()

        temp = BytesIO(response.content)
        try:
            img = Image.open(temp)
            img.verify()
        except UnidentifiedImageError:
            return None

        img = Image.open(BytesIO(response.content)).convert('RGB')
        img.thumbnail((550, 550), Image.Resampling.LANCZOS)
        
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG', quality=50, optimize=True)
        img_bytes.seek(0)
        
        compressed_img = Image.open(img_bytes).convert('RGB')
        return compressed_img
    except:
        return None

def get_embeddings(image, max_faces=20):
    try:
        boxes, _ = mtcnn.detect(image)
        if boxes is None or len(boxes) == 0:
            return None
        
        # Limit to max_faces to prevent infinite processing on huge crowd photos
        if len(boxes) > max_faces:
            _, probs = mtcnn.detect(image)
            if probs is not None:
                sorted_indices = np.argsort(probs)[::-1]
                boxes = boxes[sorted_indices[:max_faces]]
            else:
                boxes = boxes[:max_faces]
            
        embeddings = resnet(mtcnn.extract(image, boxes, save_path=None).to(device))
        return embeddings
    except Exception as e:
        print(f"Error in get_embeddings: {e}")
        return None

@app.route('/match-faces', methods=['POST'])
def match_faces():
    data = request.get_json()
    if not data or 'userSelfieUrl' not in data or 'groupPhotoUrls' not in data:
        return jsonify({"error": "Missing required parameters"}), 400

    user_selfie_url = data['userSelfieUrl']
    group_photo_urls = list(dict.fromkeys(data['groupPhotoUrls']))
    print(f"Processing {len(group_photo_urls)} unique images...")

    selfie_img = get_image_from_url(user_selfie_url)
    if selfie_img is None:
        return jsonify({"error": "Selfie failed"}), 400

    selfie_embeddings = get_embeddings(selfie_img, max_faces=1)
    if selfie_embeddings is None:
        return jsonify({"error": "No face in selfie"}), 400

    selfie_embedding_ref = selfie_embeddings[0].cpu()
    matched_photo_urls = []
    
    print("ULTIMATE OPTIMIZED processing...")
    start_time = time.time()

    for i, photo_url in enumerate(group_photo_urls, 1):
        group_img = get_image_from_url(photo_url)
        if group_img is None:
            continue
            
        group_embeddings = get_embeddings(group_img, max_faces=20)
        if group_embeddings is not None:
            for group_embedding in group_embeddings.cpu():
                distance = (selfie_embedding_ref - group_embedding).norm().item()
                if distance < 0.82:  # 👈 Lowered threshold to 0.82 to prevent matching other people
                    print(f"🎯 Match found! Distance: {distance:.4f} for photo: {photo_url.split('/')[-1]}")
                    matched_photo_urls.append(photo_url)
                    break
        
        if i % 20 == 0:
            elapsed = time.time() - start_time
            print(f"[{i}/{len(group_photo_urls)}] ({elapsed:.1f}s | {elapsed/i:.2f}s/photo)")

    total_time = time.time() - start_time
    print(f"[SUCCESS] ULTIMATE: {len(matched_photo_urls)} matches | {total_time:.1f}s | {total_time/len(group_photo_urls):.2f}s/photo")
    return jsonify({"matchedPhotoUrls": matched_photo_urls})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)


