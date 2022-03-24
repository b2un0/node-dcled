'use strict';

const URL = require('url');

const mqtt = require('mqtt');

const dcled = require('./dcled.js');

const board = new dcled();

board.connect();

const client = mqtt.connect(URL.parse(process.env.MQTT_HOST));

client.on('connect', () => {
    client.subscribe(process.env.MQTT_TOPIC);
});

client.on('message', (topic, message) => {
    let screen = board.getScreen();

    screen.clear();

    let payload = {};
    try {
        payload = JSON.parse(message.toString());
    } catch (e) {
        console.log(e);
        payload.text = 'err';
    }

    console.log(payload);

    screen.addText(payload.text, payload.align ? payload.align : 0);

    board.update(screen);
})
