FROM node:18-alpine
WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies
RUN npm install --production

EXPOSE 8080
CMD ["node", "index.js"]
