FROM node:20

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

RUN npm run build
COPY .next ./app/.next
CMD ["npm", "start"]