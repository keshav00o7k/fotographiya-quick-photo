# 📝 Fotographiya - Server Setup & Deployment Report

This document records the exact steps, paths, ports, and configurations used to deploy the **Fotographiya** application on your Ubuntu Linux server.

---

## 🖥️ Server Details
- **OS**: Ubuntu 22.04.5 LTS
- **IP Address (eno1)**: `192.168.1.50` (Local LAN)
- **SSH Port**: `2222` (Configured in place of standard port 22)
- **Active Web App Port**: `8090` (Configured to prevent conflicts with CRM on port 80 and Nextcloud on port 8080)

---

## ⚙️ Project Services & Configuration

### 1. ⚡ Express Node.js Backend API
- **Folder Path**: `/var/www/quick_photo/backend`
- **Internal Port**: `5000`
- **PM2 Process Name**: `fotographiya-backend`
- **Startup Script**: `server.js`
- **Environment Config (`.env`)**:
  ```env
  PORT=5000
  MONGODB_URL=mongodb+srv://behard1200:keshav00o7k@cluster1.x4ivpbz.mongodb.net/quick_foto?retryWrites=true&w=majority
  JWT_SECRET=production_secret_2026
  UPLOAD_PATH=/var/www/quick_photo/uploads/groups
  SELFIE_PATH=/var/www/quick_photo/uploads/selfies
  ```

### 🧠 2. Python AI Face Matching Microservice
- **Folder Path**: `/var/www/quick_photo/face-processing-service`
- **Internal Port**: `5001`
- **PM2 Process Name**: `fotographiya-ai`
- **Python Executable Path**: `venv/bin/python3 app.py`
- **Dependencies**: Installed within virtual environment (`venv`) from requirements.txt:
  - `flask`, `facenet-pytorch`, `torch`, `torchvision`, `pillow`, `requests`, `numpy`.

### 🎨 3. React Frontend Application
- **Folder Path**: `/var/www/quick_photo/frontend`
- **Build Output Directory**: `/var/www/quick_photo/frontend/build` (Served statically by Nginx)

---

## 🔀 Nginx Reverse Proxy Setup
- **Config File Path**: `/etc/nginx/sites-available/quick_photo`
- **Active Symlink**: `/etc/nginx/sites-enabled/quick_photo`
- **Nginx Config Content**:
  ```nginx
  server {
      listen 8090;
      server_name _;

      # 1. React Frontend Static Files
      location / {
          root /var/www/quick_photo/frontend/build;
          index index.html;
          try_files $uri $uri/ /index.html;
      }

      # 2. Express Backend API
      location /api/ {
          proxy_pass http://localhost:5000/api/;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      # 3. Static Assets / Photo Uploads
      location /groups/ {
          alias /var/www/quick_photo/uploads/groups/;
      }
      location /selfie/ {
          alias /var/www/quick_photo/uploads/selfies/;
      }
  }
  ```

---

## 📁 Storage Directories & Permissions
To ensure the app can write uploaded photos and selfies directly to your server:
- **Project Folder Ownership**: Configured `/var/www/quick_photo` ownership to `fotographiya:fotographiya`.
- **Upload Folders**:
  - Event Groups Path: `/var/www/quick_photo/uploads/groups`
  - Guest Selfies Path: `/var/www/quick_photo/uploads/selfies`
- **Folder Permissions**: Set to `777` recursive for the `/var/www/quick_photo/uploads` directory.

---

## 🔒 Firewall Rules (UFW)
Allowed inbound TCP traffic for the required ports:
- **Port 8090** (Fotographiya App): `sudo ufw allow 8090/tcp`
- **Port 2222** (SSH Access): `sudo ufw allow 2222/tcp`

---

## 🔄 How to Pull Future Updates
Whenever you change the code on your laptop and push to GitHub, run the following commands on the server to update it:

```bash
# 1. Navigate to the project directory
cd /var/www/quick_photo

# 2. Pull latest code from GitHub
git pull

# 3. Rebuild the frontend
cd frontend
npm install
npm run build

# 4. Restart backend & AI services
pm2 restart all
```
