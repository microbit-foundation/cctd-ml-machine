# A Dockerfile must begin with a FROM instruction.
# New base image will be built based on the Node.js version 20 
# Image that is based on Debian Linux.
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install -g express
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 8080

# Start the server using the production build
CMD [ "node", "dist/main.cjs" ]