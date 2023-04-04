FROM redis:latest
WORKDIR /home/redis
COPY redis.conf /home/redis
EXPOSE 1234
CMD [ "redis-server", "redis.conf" ]
