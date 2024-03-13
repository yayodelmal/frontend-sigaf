FROM node:14 as build-stage

WORKDIR /app

COPY ./ /app/

RUN npm install

RUN npm run build

FROM nginx:latest

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
