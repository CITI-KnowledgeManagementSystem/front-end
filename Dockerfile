FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run Prisma generate
RUN npx prisma generate

# Build the application
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the build and other necessary files
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

# Use the node user from the base image
USER node

# Start the application
CMD ["npm", "start"]
