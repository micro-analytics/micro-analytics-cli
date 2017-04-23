# This is used to be able to write to the flat-file-db
FROM node

RUN mkdir -p /opt/micro-analytics
WORKDIR /opt/micro-analytics
COPY . /opt/micro-analytics

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
