
FROM phusion/baseimage:0.11
# RUN useradd -ms /bin/false newuser

# CMD ["/sbin/my_init"]

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN apt-get update
RUN apt-get install -y build-essential libssl-dev

RUN mkdir /root/.nvm
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 12.13.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
RUN chmod +x $HOME/.nvm/nvm.sh
RUN . $HOME/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default && npm install -g npm

RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/nodejs
RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/node
RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm

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