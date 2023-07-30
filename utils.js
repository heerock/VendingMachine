String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function validateCard(card) {
    const keys = ['number', 'cardType'];
    if(!card) return { status: false, message: LOG_MESSAGE.CARD_INFO_FAILED };
    const cardKeys = Object.keys(card);
    for(const key of keys) {
      if(!cardKeys.includes(key)) {
        return { status: false, message: `카드의 ${key} 정보가 없습니다.` };
      }
    }
    return { status: true, message: LOG_MESSAGE.CARD_INFO_SUCCESS };

};

const PAYMENT_TYPE = {
    CASH: 'CASH',
    CARD: 'CARD',
};

const CASH_TYPE = {
    C100: 100,
    C500: 500,
    C1000: 1000,
    C5000: 5000,
    C10000: 10000,
};

const ACTION_TYPE = {
    INSERT_CASH: 'INSERT_CASH',
    INSERT_CARD: 'INSERT_CARD',
    REMOVE_CARD: 'REMOVE_CARD',
    SELECTED_PRODUCT: 'SELECTED_PRODUCT',
    RETURN_CASH: 'RETURN_CASH',
    GET_PRODUCTS: 'GET_PRODUCTS',
};

const LOG_MESSAGE = {
    FOBIDDEN_ACTION_TYPE: `{0} 유형은 잘못된 접근입니다.`,
    TURN_OFF_BUY_PAYMENT_SUCCESS: `전원이 꺼진 상태로 {0} -{1}원이 상품이 결제 되었습니다.`,
    TURN_ON_SUCCESS: `{0}가 정상적으로 실행되었습니다.`,
    TURN_OFF_SUCCESS: `{0}가 정상적으로 종료되었습니다.`,
    BUY_PRODUCT_SUCCESS: `{0} 상품 구매가 완료되었습니다. (-{1}원)`,
    BUY_PRODUCT_FAILED: `{0} 상품을 구매하는데 실패하였습니다.`,
    KEEP_CASH: `잔돈 {0}원을 반환합니다.`,
    INSERT_CASH: `{0}원을 넣으셨습니다.`,
    PAYMENT_CARD_MESSAGE: `[{0}] {1} ({2}:{3}원)`,
    SELECTED_PRODUCT: `{0} 상품을 선택하셨습니다.`,
    DONT_USE_CASH_TYPE: `{0}원은 사용할 수 없습니다.`,
    CURRENT_CASH: `현재 {0}원이 들어있습니다.`,
    LOG_INFO_FORMAT: `{0} | INFO | {1}`,
    LOG_WARN_FORMAT: `{0} | WARN | {1}`,
    ALREADY_TURN_ON: '이미 실행되어 있습니다.',
    ALREADY_TURN_OFF: '이미 종료되어 있습니다.',
    TURN_ON_STATUS: '전원이 켜져있습니다.',
    TURN_OFF_STATUS: '전원이 꺼져있습니다.',
    CARD_INFO_FAILED: '정상적으로 카드가 입력되지 않았습니다.',
    CARD_INFO_SUCCESS: '카드 정보가 정상적으로 들어왔습니다.',
    PAYMENTING_DURING_CAN_NOT_SELECT_PRODUCT: '결제 중에는 상품을 선택할 수 없습니다.',
    PAYMENTING_DURING_CAN_NOT_REMOVE_CARD: '결제 중에는 카드를 뺄 수 없습니다.',
    PAYMENTING_DURING_CAN_NOT_GET_PRODUCTS: '결제 중에는 상품을 조회할 수 없습니다.',
    REMOVED_CARD_SUCCESS: '정상적으로 카드를 빼셨습니다.',
    REMOVED_CARD_TIMEOUT: '시간 초과로 카드 인식이 해제되었습니다.',
    NO_CARD_RECOGNIZED: '인식된 카드가 없습니다.',
    ALREADY_IN_USE_CASH_DONT_INSERT_CARD: '현금 결제 중에는 카드를 넣을 수 없습니다.',
    ALREADY_IN_USE_CARD_DONT_INSERT_CASH: '카드 결제 중에는 돈을 넣을 수 없습니다.',
    INVALID_IS_ID: '상품 ID 값이 잘못 입력 되었습니다.',
    SOLD_OUT_PRODUCT: '선택된 상품이 품절 되었습니다.',
    NOT_FOUND_PRODUCT: '선택된 상품을 찾을 수 없습니다.',
    SELECT_PAYMENT_TYPE: '결제 방법을 선택해주세요.',
    INSUFFICIENT_CASH: '잔액이 부족합니다.',
    INVALID_PRODUCT: '선택 가능한 상품이 없습니다.',
};

const HTTP_RESPONSE_CODE = {
    SUCCESS: [200, 201, 202],
    FAILED: [400, 404, 500]
};

module.exports = {
    PAYMENT_TYPE,
    CASH_TYPE,
    ACTION_TYPE,
    LOG_MESSAGE,
    HTTP_RESPONSE_CODE,
    validateCard,
}