FROM node:18-alpine

WORKDIR /app

# Install http-server globally to serve static files
RUN npm install -g http-server

# Copy dependency list
COPY package*.json ./

# Install axios and local dependencies
RUN npm install

# Copy your HTML, JS, and CSS files
COPY . .

# Port 80 as defined in your docker-compose
EXPOSE 80

# Start serving the current directory on port 80
CMD ["http-server", ".", "-p", "80"]