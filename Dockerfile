FROM node:18

RUN apt-get update && apt-get install -y default-mysql-server && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN echo "databases/" > .dockerignore

COPY . .

RUN mkdir -p /databases
VOLUME ["/databases"]

COPY mysql_setup.sh /usr/src/app/
RUN chmod +x /usr/src/app/mysql_setup.sh

RUN echo "#!/bin/bash \n\
    /usr/src/app/mysql_setup.sh \n\
    node process-database.js \$1" > /usr/src/app/entrypoint.sh && \
    chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"] 