const Logger = require('./logger')
const { LOG_MESSAGE } = require('./utils')
class Machine {
    constructor(name) {
      this.name = name;
      this.status = false;
      this.logger = Logger.getInstance();
    }

    turnOn() {
      if(!this.status) {
        this.status = true;
        this.logger.log(LOG_MESSAGE.TURN_ON_SUCCESS.format(this.name));
      } else {
        this.logger.log(LOG_MESSAGE.ALREADY_TURN_ON);
      } 
    }
    
    turnOff() {
        if(this.status) {
            this.status = false;
            this.logger.log(LOG_MESSAGE.TURN_OFF_SUCCESS.format(this.name));
        } else {
          this.logger.log(LOG_MESSAGE.ALREADY_TURN_OFF);
        }
    }

    currentStatus() {
        if(!this.status) this.logger.log(LOG_MESSAGE.TURN_OFF_STATUS);
        // else this.logger.log(LOG_MESSAGE.TURN_ON_STATUS)
        return this.status ? true : false
    }
}

module.exports = Machine