# Frontend Dockerfile (Next.js)
FROM node:14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into the container
COPY . .

# Expose the port the frontend will run on (usually 4000 for Next.js)
EXPOSE 4000

# Run the frontend server (Next.js)
CMD ["npm", "run", "dev"]
