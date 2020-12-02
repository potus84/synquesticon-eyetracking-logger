FROM node:latest
EXPOSE 3001

COPY "etLogger.js" "/etLogger.js"
COPY "package.json" "/package.json"
COPY "package-lock.json" "/package-lock.json"
COPY "config.js" "/config.js"
COPY "connection_string.js" "/connection_string.js"

RUN "npm" "install"

CMD ["node", "etLogger.js"]
