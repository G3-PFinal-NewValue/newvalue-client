FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

#Vite dev server
EXPOSE 5173

#Importante para Vite dentro de Docker (host 0.0.0.0)
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0"]