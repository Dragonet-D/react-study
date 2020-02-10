FROM docker.artifactory.kaisquare.com/ummi/ummibasenginx:v4

# copy static files

COPY  ./build  /usr/share/nginx/html
COPY ./ummi-nginx.crt /ummi-nginx.crt
COPY ./ummi-nginx.key /ummi-nginx.key
# copy nginx.conf
COPY  ./ummi-ssl.config /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
  chown -R ivhummi:ivhummi /var/run/nginx.pid && \
  chown -R ivhummi:ivhummi /var/cache/nginx
USER ivhummi

WORKDIR /home/ivhummi
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=3s CMD curl --fail https://localhost:443 || exit 1

