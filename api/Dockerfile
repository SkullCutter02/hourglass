FROM node:alpine
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build
RUN git clone https://github.com/vishnubob/wait-for-it.git
CMD ./wait-for-it/wait-for-it.sh $PG_HOST:5432 -t 0 -- npm run typeorm migration:run  && npm run start
#CMD npm run typeorm migration:run && npm run start