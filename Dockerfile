# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for root
COPY package*.json ./

# Install root dependencies
RUN npm install --legacy-peer-deps

# Copy package.json and package-lock.json (or yarn.lock) for client
COPY ./client/package*.json ./client/

# Install client dependencies
RUN cd ./client && npm install --legacy-peer-deps

# Copy package.json and package-lock.json (or yarn.lock) for server
COPY ./server/package*.json ./server/

# Install server dependencies
RUN cd ./server && npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]