# GIAI ĐOẠN 1: Build Frontend React (Vite)
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Điều chỉnh đường dẫn COPY trỏ vào thư mục app/frontend
COPY app/frontend/package*.json ./
RUN npm install
COPY app/frontend/ ./
RUN npm run build

# GIAI ĐOẠN 2: Chạy Backend Node.js
FROM node:18-alpine
WORKDIR /app

# Cài đặt dependencies cho Backend - trỏ vào app/backend
COPY app/backend/package*.json ./
RUN npm install

# Copy mã nguồn Backend
COPY app/backend/ ./

# Copy thư mục đã build từ Frontend vào thư mục public của Backend
# Lưu ý: Vite mặc định build ra thư mục 'dist', không phải 'build' như Create React App
# Tôi sẽ copy từ 'dist' sang 'public' để server.js phục vụ file tĩnh
COPY --from=frontend-builder /app/frontend/dist ./public

# Cấu hình môi trường
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Chạy server Node.js
CMD ["node", "server.js"]