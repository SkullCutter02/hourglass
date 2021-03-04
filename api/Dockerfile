FROM node:alpine
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build
CMD npm run start && npm run typeorm migration:run