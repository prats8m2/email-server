FROM node:16.17.0-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
RUN apt-get update && apt-get install -y curl

# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# for typescript
RUN npm run build
WORKDIR ./dist/src

EXPOSE 8001
CMD node app.js