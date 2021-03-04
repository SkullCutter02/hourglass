FROM node:alpine as builder
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/local/app/build ./build
ENV NODE_ENV=production
EXPOSE 5000
CMD npm start && npm run typeorm migration:run