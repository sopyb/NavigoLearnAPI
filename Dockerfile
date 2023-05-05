FROM node:lts AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN source ./env/production.env

EXPOSE ${PORT}

# Start the app
CMD ["npm", "start"]