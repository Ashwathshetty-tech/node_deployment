FROM node:23.7.0 as build
WORKDIR /app
#RUN apk add --no-cache git
COPY package*.json ./
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm cache clean --force && \
    npm install
COPY src ./src/
EXPOSE 3008
# RUN npm run prebuild
# RUN npm run build
CMD ["node", "src/index.js"]