FROM node:alpine as builder
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run export

FROM nginx
EXPOSE 3000
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/local/app/out /usr/share/nginx/html