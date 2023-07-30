const { PAYMENT_TYPE, CASH_TYPE, ACTION_TYPE, LOG_MESSAGE, validateCard } = require('./utils')
const PaymentCard = require('./paymentCard')
const Machine = require('./machine')
class VendingMachine extends Machine {
  constructor() {
    super('자판기')
    this.products = [
      { id: 0, name: '콜라', price: 1100 },
      { id: 1, name: '물', price: 600 },
      { id: 2, name: '커피', price: 700 },
    ];
    
    this.price = 0;
    this.type = null;
    this.payment = null;
    this.timeout = null;
    this.cardInfo = null;
    this.timeoutLimit = 30000;
    this.init();
  }

  startTimeout() {
    this.timeout = setTimeout(() => {
      if(this.type === PAYMENT_TYPE.CASH) this.action(ACTION_TYPE.RETURN_CASH);
      else this.action(ACTION_TYPE.REMOVE_CARD, true);
      this.type = null;
      this.payment = null;
    }, this.timeoutLimit)
  }

  clearTimeout() {
    clearTimeout(this.timeout);
  }

  init() {
    this.products = this.products.map((product) => ({ ...product, stock: 3 }));
  }

  action(actionType, params = null) {
    if(!this.currentStatus()) return;
    if(ACTION_TYPE[actionType]) this.clearTimeout();
    switch(actionType) {
      case ACTION_TYPE.INSERT_CASH:
        this.insertCash(params);
        break;
      case ACTION_TYPE.INSERT_CARD:
        this.insertCard(params);
        break;
      case ACTION_TYPE.REMOVE_CARD:
        if(this.isPaymenting(LOG_MESSAGE.PAYMENTING_DURING_CAN_NOT_REMOVE_CARD)) break;
        this.removeCard(params)
        break;
      case ACTION_TYPE.SELECTED_PRODUCT:
        if(this.isPaymenting(LOG_MESSAGE.PAYMENTING_DURING_CAN_NOT_SELECT_PRODUCT)) break;
        this.selectedProduct(params);
        break;
      case ACTION_TYPE.RETURN_CASH:
        this.returnCash(params);
        break;
      case ACTION_TYPE.GET_PRODUCTS:
        if(this.isPaymenting(LOG_MESSAGE.PAYMENTING_DURING_CAN_NOT_GET_PRODUCTS)) break;
        this.getProducts();
        break;
      default:
        this.logger.log(LOG_MESSAGE.FOBIDDEN_ACTION_TYPE.format(actionType));
    }
  }

  getProducts() {
    let products = null;
    let products_view = [];

    if(this.type === PAYMENT_TYPE.CASH) {
      products = this.products.filter((product) => this.price >= product.price && product.stock > 0);
    } else {
      products = this.products.filter((product) => product.stock > 0);
    }

    this.logger.products('========================== 선택 가능한 상품 ==========================');
    if(products.length > 0) {
      products = products.map((product, idx) => {
        if(idx % 4 === 0 && idx > 0) str += '\n'
        let str = `[${product.id}] ${product.name}(${product.price}원)`
        products_view.push(str)
        return { id: product.id, name: product.name, price: product.price }
      });
      this.logger.products(products_view.join(' | '));
    } else {
      this.logger.log(LOG_MESSAGE.INVALID_PRODUCT);
    }
    this.logger.products('======================================================================');

    if(this.type === PAYMENT_TYPE.CASH) this.logger.log(LOG_MESSAGE.CURRENT_CASH.format(this.price));

    this.startTimeout();
    return products;
  }

  insertCard(card) {
    if(this.type === PAYMENT_TYPE.CASH) {
      this.logger.log(LOG_MESSAGE.ALREADY_IN_USE_CASH_DONT_INSERT_CARD);
      return;
    }

    const { status, message } = validateCard(card);

    this.logger.log(message);
    if(!status) return;
    
    this.type = PAYMENT_TYPE.CARD;
    this.cardInfo = card;
    this.action(ACTION_TYPE.GET_PRODUCTS);
  }

  removeCard(timeout) {
    this.type = null;
    this.payment = null;
    if(!this.cardInfo) {
      this.logger.log(LOG_MESSAGE.NO_CARD_RECOGNIZED);
    } else {
      this.cardInfo = null;
      if(timeout) {
        this.logger.log(LOG_MESSAGE.REMOVED_CARD_TIMEOUT);
      } else {
        this.logger.log(LOG_MESSAGE.REMOVED_CARD_SUCCESS);
      }
    }
  }

  insertCash(cash) {
    if(this.type === PAYMENT_TYPE.CARD) {
      this.logger.log(LOG_MESSAGE.ALREADY_IN_USE_CARD_DONT_INSERT_CASH);
      this.action(ACTION_TYPE.RETURN_CASH, cash);
      return;
    }

    this.logger.log(LOG_MESSAGE.INSERT_CASH.format(cash));
    if(CASH_TYPE[`C${cash}`]) {
      this.type = PAYMENT_TYPE.CASH;
      this.price += cash;
      this.action(ACTION_TYPE.GET_PRODUCTS);
    } else {
      this.logger.log(LOG_MESSAGE.DONT_USE_CASH_TYPE.format(cash));
      this.action(ACTION_TYPE.RETURN_CASH, cash);
    }
  }

  selectedProduct(productId) {
    if(!this.type) {
      this.logger.log(LOG_MESSAGE.SELECT_PAYMENT_TYPE);
      return;
    }

    if(typeof productId !== 'number') {
      this.logger.log(LOG_MESSAGE.INVALID_IS_ID);
      this.action(ACTION_TYPE.GET_PRODUCTS);
      return;
    }

    const selectedProduct = this.products[productId]
    if(!selectedProduct) {
      this.logger.log(LOG_MESSAGE.NOT_FOUND_PRODUCT);
      this.action(ACTION_TYPE.GET_PRODUCTS);
      return;
    }

    if(selectedProduct.stock === 0) {
      this.logger.log(LOG_MESSAGE.SOLD_OUT_PRODUCT);
      this.action(ACTION_TYPE.GET_PRODUCTS);
      return;
    }

    this.logger.log(LOG_MESSAGE.SELECTED_PRODUCT.format(selectedProduct.name));
    this.requestPayment(selectedProduct);
  }

  async requestPayment(selectedProduct) {
    if(this.type === PAYMENT_TYPE.CASH) {
      if(this.price >= selectedProduct.price) {
        this.payment = true;
        this.products[selectedProduct.id].stock -= 1;
        this.price -= selectedProduct.price;
        this.logger.log(LOG_MESSAGE.BUY_PRODUCT_SUCCESS.format(selectedProduct.name, selectedProduct.price));
        if(!this.status) this.logger.warn(LOG_MESSAGE.BUY_PRODUCT_SUCCESS.format(selectedProduct.name, selectedProduct.price));
        this.payment = null;
        if(this.price === 0) {
          this.clearTimeout();
          return;
        }
      } else {
        this.logger.log(LOG_MESSAGE.INSUFFICIENT_CASH);
      }
    } else {
      this.payment = new PaymentCard(this.cardInfo);
      const result = await this.payment.requestPayment(selectedProduct);
      if(result) {
        this.products[selectedProduct.id].stock -= 1;

        this.logger.log(LOG_MESSAGE.BUY_PRODUCT_SUCCESS.format(selectedProduct.name, selectedProduct.price));
        if(!this.status) this.logger.warn(LOG_MESSAGE.TURN_OFF_BUY_PAYMENT_SUCCESS.format(selectedProduct.name, selectedProduct.price));
      } else {
        this.logger.log(LOG_MESSAGE.BUY_PRODUCT_FAILED.format(selectedProduct.name));
      }
      this.payment = null;
    }

    this.action(ACTION_TYPE.GET_PRODUCTS);
  }

  isPaymenting(message) {
    if(this.payment) this.logger.log(message);
    return this.payment ? true : false
  }

  returnCash(cash) {
    if(!cash) {
      this.logger.log(LOG_MESSAGE.KEEP_CASH.format(this.price));
    } else {
      this.logger.log(LOG_MESSAGE.KEEP_CASH.format(cash));
      if(this.price > 0) {
        this.action(ACTION_TYPE.GET_PRODUCTS);
        return;
      }
    }
    this.price = 0;
  }
}

module.exports = VendingMachine;
