FROM node:20-alpine AS build
WORKDIR /app
ARG BASE_PATH=/
ENV BASE_PATH=$BASE_PATH

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
ARG BASE_PATH=/
ENV BASE_PATH=$BASE_PATH

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
