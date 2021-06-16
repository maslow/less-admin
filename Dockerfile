FROM nginx:latest
WORKDIR /app
ADD ./dist /app/
EXPOSE 80
ADD ./nginx.conf /etc/nginx/conf.d/app.conf