FROM node:latest
EXPOSE 3001

COPY "etLogger.js" "/etLogger.js"
COPY "config.js" "/config.js"

RUN "mkdir" "/node_modules"

ADD "node_modules" "/node_modules"

CMD ["node", "etLogger.js"]
