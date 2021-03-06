FROM node:alpine as builder
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm install --only=production
RUN npm install ts-node
COPY --from=builder /usr/local/app/build ./build
COPY --from=builder /usr/local/app/ormconfig.js ./
ENV NODE_ENV=production
EXPOSE 5000
CMD npm run typeorm migration:run && npm start