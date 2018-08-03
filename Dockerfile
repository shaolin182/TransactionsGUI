# From NodeJS Version 9
FROM node:9

# Create app directory
WORKDIR /usr/src/app

# Copy package.json file here in order to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install HTTP Server
RUN npm install http-server -g

# Install karma for running test
RUN npm install -g karma-cli

# Install bower
RUN npm install -g bower

# Install Google Chrome for Karma test
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

# Copy bower conf files
COPY *bower* ./

# Install bower dependencies
RUN bower install

# Bundle app source
COPY . .

# Create mount points for source code and modules
VOLUME /usr/src/app/
VOLUME /usr/src/app/node_modules
VOLUME /usr/src/app/src/bower_components

# Listen port
EXPOSE 8000

# Run app
CMD [ "npm", "start" ]
