# Etapa de build amb Node
FROM node:18-alpine AS builder

# Directori de treball
WORKDIR /app

# Copia només les dependències primer per aprofitar la cache de Docker
COPY package*.json ./

# Instal·la les dependències (amb les dev incloses)
RUN npm ci

# Copia el codi font
COPY . .

# Rep un ARG per escollir l'entorn: development, staging, production...
ARG BUILD_MODE=production

# Exporta com a variable d'entorn per a Vite
ENV NODE_ENV=$BUILD_MODE

# Fa el build amb el mode indicat (passat com ARG)
RUN npm run build -- --mode $BUILD_MODE || (echo "Build failed, checking logs..." && npm run build -- --mode $BUILD_MODE 2>&1 | tee build.log && exit 1)

# Etapa final: Nginx per servir l'app
FROM nginx:alpine

# Copia el build generat
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuració nginx personalitzada (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
