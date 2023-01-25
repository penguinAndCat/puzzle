FROM node:18

WORKDIR /nextjs/puzzle

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]