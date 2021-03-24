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
ENV NEXT_PUBLIC_VAPID_KEY=BCNWScqrYvZ8XT4DO2bqyz6qFMl49Z72-RkonAZZ1oAmpFZAiU6LnNBmWtf__V_qRAHYT6PbvJjoN8Yb5MNrhe0
EXPOSE 3000
CMD npm run start