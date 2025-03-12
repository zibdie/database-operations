FROM node:18

RUN apt-get update && apt-get install -y default-mysql-server dos2unix && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN echo "databases/" > .dockerignore

COPY . .

RUN mkdir -p /databases
VOLUME ["/databases"]

RUN dos2unix /usr/src/app/mysql_setup.sh && chmod +x /usr/src/app/mysql_setup.sh

RUN echo "#!/bin/bash" > /usr/src/app/entrypoint.sh && \
    echo "/usr/src/app/mysql_setup.sh" >> /usr/src/app/entrypoint.sh && \
    echo "node process-database.js \$1" >> /usr/src/app/entrypoint.sh && \
    chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"] 