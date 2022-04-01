# Node.js dcled controller


This is a NodeJS driver/framework for the `Dream Cheeky USB Message Board`.
It contains preinstalled plugins for weather, clock and Bitcoin exchange rate. Custom plugins can be easily written.

![](https://img.shields.io/github/license/b2un0/node-dcled.svg)
![](https://img.shields.io/docker/pulls/b2un0/dcled.svg)
![](https://img.shields.io/docker/stars/b2un0/dcled.svg)
![](https://img.shields.io/docker/image-size/b2un0/dcled.svg)
![](https://github.com/b2un0/dcled/workflows/container/badge.svg)


### run examples
```bash
git clone https://github.com/b2un0/node-dcled.git
cd node-dcled
npm install
npm install --only=dev
npm run-script examples
```

### install as dependency in your project
```bash
npm install dcled
```

#### use in your project

```js
const dcled = require('dcled');
let board = new dcled();
board.connect();

// inspect the examples for more

```

## Docker

There is a Docker Container with mqtt client https://hub.docker.com/r/b2un0/dcled

```yaml
services:
    dcled:
        image: b2un0/dcled:latest
        restart: always
        container_name: dcled
        network_mode: bridge
        devices:
            - /dev/bus/usb
        environment:
            NODE_HID_DRIVER: "libusb"
            DCLED_DEVICE_NUMBER: "0"
            MQTT_HOST: "mqtt://192.168.1.2:1883"
            # MQTT_HOST: "mqtt://USERNAME@PASSWORD:192.168.1.2:1883"
            MQTT_TOPIC: "home/dcled"
```

the topic payload must be a json like this:

```json5
{
    "text": "word", // must be a string (short)
    "align": 0 // optional, positive integer padding from left side, negative integer = padding from right side, 0 = default = auto
}
```
