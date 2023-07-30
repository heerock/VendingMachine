const Logger = require('./logger');
const { HTTP_RESPONSE_CODE, LOG_MESSAGE } = require('./utils')

class PaymentCard {
    constructor(card) {
        this.cardInfo = card;
        this.storeId = 'S000120102';
        this.logger = Logger.getInstance();
    }

    async requestPayment(product) {
        const orderId = new Date().getTime();
        const { statusCode, ...rest } = await this.getData(this.cardInfo);

        if(HTTP_RESPONSE_CODE.SUCCESS.includes(statusCode)) {
          LOG_MESSAGE.PAYMENT_CARD_MESSAGE.format(rest.data.code, rest.data.message, product.name, product.price);
          this.logger.log(LOG_MESSAGE.PAYMENT_CARD_MESSAGE.format(rest.data.code, rest.data.message, product.name, product.price));
        } else {
          this.logger.log(LOG_MESSAGE.PAYMENT_CARD_MESSAGE.format(rest.errorCode, rest.Description, product.name, product.price));
          return false;
        }
        return true;
    }

    // 결제 모듈을 통한 데이터 받는 예시
    async getData(cardInfo) {
        const status = [
          { statusCode: 200, data: { code: 'C001', message: '정상 카드 결제 완료'}, card: cardInfo},
          { statusCode: 400, errorCode: 'E001', Description: '카드 결제 내부 처리 오류', card: cardInfo },
        ];
        return Promise.resolve(status[0]);
    }
}

module.exports = PaymentCard
