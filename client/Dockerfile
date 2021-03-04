FROM node:alpine as builder
WORKDIR /usr/local/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:alpine
WORKDIR /usr/local/app
COPY --from=builder /usr/local/app/package.json ./package.json
COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/.next ./.next
COPY --from=builder /usr/local/app/public ./public
COPY --from=builder /usr/local/app/styles.css ./styles.css
EXPOSE 3000
CMD npm run start