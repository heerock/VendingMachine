const { LOG_MESSAGE } = require('./utils')
class Logger {
    TIME_ZONE = 9 * 60 * 60 * 1000;
    static instance = new Logger();
    static getInstance() {
        if(!this.instance) this.instance = new Logger();
        return this.instance;
    }

    log(message) {
        console.log(LOG_MESSAGE.LOG_INFO_FORMAT.format(this.timestamp(), message));
    }

    warn(message) {
        console.warn(LOG_MESSAGE.LOG_WARN_FORMAT.format(this.timestamp(), message));
    }

    products(message) {
        console.log(message);
    }

    timestamp() {
        const d = new Date();
        const timestamp = new Date(d.getTime() + this.TIME_ZONE)
        .toISOString()
        .replace('T', ' ')
        .slice(0, -5);

        return timestamp;
    }

}

module.exports = Logger;