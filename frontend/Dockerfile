# Use official Node image
FROM node:20-slim

# Set environment variables
ENV NODE_ENV=development

# Set work directory
WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
