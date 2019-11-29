
FROM phusion/baseimage:0.11
# RUN useradd -ms /bin/false newuser

# CMD ["/sbin/my_init"]

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN install_clean \
  make \
  g++ \
  ruby \
  npm \
  python \
  && npm install \
  && cd client \
  && npm install \
  && npm run build

EXPOSE 8000

# USER newuser

CMD ["node", "server.js"]

