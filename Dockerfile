FROM mhart/alpine-node:latest

WORKDIR /app

COPY . .

RUN npm ci --prod

EXPOSE 5000

CMD ["npm", "start"]