FROM nginx:latest

EXPOSE 80/tcp
EXPOSE 443/tcp

COPY build /admin/www
COPY .nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /admin
