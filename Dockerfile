FROM ubuntu:14.04

# Setup NodeSource Official PPA

RUN apt-get update && \
    apt-get install -y --force-yes \
      curl \
      apt-transport-https \
      lsb-release \
      build-essential \
      ruby \
      ruby-dev

RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get update
RUN apt-get install nodejs -y --force-yes

# Install Bower & Grunt
RUN npm install -g bower grunt-cli

RUN gem install sass compass

RUN groupadd -r spotifyght && useradd -r -g spotifyght spotifyght

COPY . /app

WORKDIR /app

RUN npm install

RUN grunt prod

ENV REDISDB redis

EXPOSE 3000

CMD ["node", "server.js"]
