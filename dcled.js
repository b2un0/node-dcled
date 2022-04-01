'use strict';

const HID = require('node-hid');

const screen = require('./lib/screen.js');

class dcled {

    constructor() {
        this.interval = null;

        this.sizeX = 21;
        this.sizeY = 7;

        this.connectInterval = null;

        this.packetBytes = [];

        this.screen = new screen();
    }

    connect() {
        HID.setDriverType(process.env.NODE_HID_DRIVER ?? 'hidraw')

        let devices = HID.devices(0x1d34, 0x0013);
        if (devices.length) {
            this.device = new HID.HID(devices[process.env.DCLED_DEVICE_NUMBER ?? '0'].path);

            if (this.connectInterval) {
                clearInterval(this.connectInterval);
                this.connectInterval = null;
            }

            console.log('dcled board connected');

            // keep this loop running for always displaying the last display state, otherwise the screen would be flushed after ~0.4 seconds.
            this.interval = setInterval(this.refresh.bind(this), 200);

        } else {
            console.log('dcled board not found');
        }
    }

    disconnect() {
        this.device.close();

        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    update(screen) {
        //set bits for each row

        let rowBytes = [];

        for (let y = 0; y < this.sizeY; y++) {
            let bytes = [0xFF, 0xFF, 0xFF];
            let bytep = 2;
            let bitp = 0;

            for (let x = 0; x < this.sizeX; x++) {
                if (screen.get(x, y)) {
                    bytes[bytep] &= ~(1 << bitp);
                }

                if (++bitp > this.sizeY) {
                    bitp = 0;
                    bytep--;
                }
            }
            rowBytes.push(bytes);
        }

        //make bytes that will be written to device
        this.packetBytes.length = 0;

        for (let i = 0; i < this.sizeY; i += 2) {
            let row1 = rowBytes[i];
            let row2 = i !== 6 ? rowBytes[i + 1] : [0x00, 0x00, 0x00];
            let bytes = [0x01, i, row1[0], row1[1], row1[2], row2[0], row2[1], row2[2]];
            this.packetBytes.push(bytes);
        }

        this.refresh();
    }

    refresh() {
        for (let i = 0; i < this.packetBytes.length; i++) {
            try {
                this.device.write(this.packetBytes[i]);
            } catch (e) {
                if (!this.connectInterval) {
                    console.log('board disconnected');
                    this.connectInterval = setInterval(this.connect.bind(this), 1000);
                }
            }
        }
    }

    getScreen() {
        return this.screen;
    }
}

module.exports = dcled;
