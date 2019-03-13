# From NodeJS Version 10
FROM node:10 as base

# Create app directory
WORKDIR /usr/src/app

# Copy package.json file here in order to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod
RUN npm install http-server -g

# Bundle app source
COPY . .

FROM base as test

# Install dev dependencies & tools
RUN npm install -g karma-cli
RUN npm install --only=dev

# Install Google Chrome for Karma test
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

# RUn CICD Tools
RUN npm test
RUN npm run-script lint;exit 0

FROM base as release

# COPY test results in order to be used by jenkins
COPY --from=test /tmp /tmp

# Create mount points for source code and modules
VOLUME /usr/src/app/
VOLUME /usr/src/app/node_modules
VOLUME /usr/src/app/src/bower_components

# Listen port
EXPOSE 8000

# Run app
CMD [ "npm", "start" ]
