FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

EXPOSE 3000

CMD ["node", "app/app.js"]