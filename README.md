# 📸 Fotographiya - Smart Event Photo Sharing Platform

Fotographiya is an advanced AI-powered event photo sharing platform that allows photographers and event organizers to upload large photo albums, while enabling guests to instantly find their personal photos using facial recognition AI.

---

## 🚀 Key Features

- 🤖 **AI Facial Recognition Matching**: Guests upload a selfie, and the Python PyTorch AI service automatically detects their face and filters out all their personal photos from thousands of event images.
- ⚙️ **Group Settings & Cover Cropper**: Admins can customize album names and use a smartphone-style interactive cropper (drag & zoom) to format album cover banners.
- 💧 **Custom Drag & Drop Watermarking**: Admins can add custom brand text or upload logo watermarks, drag them to any custom position on the image, scale their size, and automatically stamp them onto user-downloaded photos.
- 🖼️ **Natural Aspect Ratio Masonry Gallery**: Pinterest/Unsplash-style responsive column masonry grid that displays landscape and portrait photos in their natural orientation without cropping.
- 🔒 **Privacy Settings**: Configurable album privacy modes (`Small Personal Group` vs `Big Public Group`).
- 📱 **Mobile First & Fully Responsive**: Sleek, high-contrast white & lavender modern UI optimized for touch screens and mobile devices.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, Axios, React Toastify, Modern CSS3 (Glassmorphism & CSS Grid/Masonry).
- **Backend API**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT Authentication, Multer file upload storage.
- **AI Microservice**: Python 3.10, Flask, PyTorch, MTCNN (Face Detection), InceptionResnetV1 (Facial Embeddings), Pillow, OpenCV.

---

## 📁 Repository Structure

```
QUICK_PICK/
├── backend/                  # Node.js Express API Server
│   ├── config/               # Database connection & DNS configs
│   ├── controllers/          # Auth, Group, Media controllers
│   ├── middlewares/          # JWT auth & Multer upload middlewares
│   ├── models/               # User, Group, Media schemas
│   └── routes/               # Express API endpoints
├── face-processing-service/  # Python PyTorch Face Recognition Flask App
│   └── app.py                # Face matching REST endpoint
├── frontend/                 # React SPA Frontend Application
│   ├── src/
│   │   ├── components/       # Navbar, Dashboard, GroupDetail, GroupSettingModal
│   │   ├── pages/            # Login, Register, Dashboards, SelfieCapture
│   │   └── utils/            # Axios instance configuration
└── README.md                 # Project documentation
```

---

## ⚡ Setup & Running Locally

### 1. Prerequisites
- Node.js (v16+) & npm
- Python 3.10+ with pip
- MongoDB Atlas cluster credentials

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend server will run at `http://localhost:5000`*

### 3. AI Face Processing Service Setup
```bash
cd face-processing-service
pip install -r requirements.txt
python app.py
```
*Python AI microservice will run at `http://localhost:5001`*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```
*React app will run at `http://localhost:3000`*

---

## 📄 License

Developed with ❤️ for Fotographiya Event Management.
