FROM node:18.18.0 as builder

# set working directory
WORKDIR /game

# install app dependencies
COPY ./package*.json ./
RUN npm install

# build app
COPY ./public ./public
COPY ./src ./src
COPY ./.env* ./
RUN npm run build --clean

# copy build to nginx
FROM nginx:1.25.3
COPY ./nginx/default.conf /etc/nginx/conf.d
COPY ./ssl /ssl
WORKDIR /usr/share/nginx/html
COPY --from=builder /game/build ./