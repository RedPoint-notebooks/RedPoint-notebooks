
FROM phusion/baseimage:0.11
RUN useradd -ms /bin/false newuser

CMD ["/sbin/my_init"]

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN install_clean \
  make \
  g++ \
  ruby \
  npm \
  nodejs \
  python \
  && npm install \
  && cd react-redpoint \
  && npm install \
  && cd ..

EXPOSE 3000

USER newuser

CMD ["npm", "start"]


