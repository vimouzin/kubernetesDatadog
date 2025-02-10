# Stage 1: Application setup with linux/amd64
# ✅ Use Debian 12 (Bookworm) for better compatibility
FROM node:18-bookworm
# Set the working directory
WORKDIR /usr/src/app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install


# Copy the application source code
COPY . .

# Expose the application port
EXPOSE 8080

CMD ["node", "app.js"]