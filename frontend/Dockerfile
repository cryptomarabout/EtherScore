FROM node:16-alpine 
WORKDIR /app
EXPOSE 8080
COPY package.json ./
RUN npm install
CMD [ "npm", "run", "serve" ]
