FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8545 8546

CMD ["npx", "hardhat", "node"]