FROM node:lts-alpine

ENV NODE_PATH="/usr/local/lib/node_modules" \
    NODE_ENV="production" \
    MQTT_HOST="" \
    MQTT_TOPIC=""

ADD . /app

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        libc-dev \
        g++ \
        hidapi \
        libusb-dev \
        eudev-dev \
        linux-headers \
        && yarn global add node-gyp \
        && yarn install \
        && yarn add mqtt \
        && yarn global remove node-gyp \
        && apk del .gyp \
        && apk add --no-cache eudev libusb

CMD ["node", "mqtt.js"]

SHELL ["/bin/ash"]
