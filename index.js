const VendingMachine = require('./vendingMachine');
const { ACTION_TYPE } = require('./utils')

const vendingMachine = new VendingMachine();
vendingMachine.turnOn();

// 현금 정상 결제
vendingMachine.action(ACTION_TYPE.INSERT_CASH, 5000);
vendingMachine.action(ACTION_TYPE.INSERT_CASH, 5000);
vendingMachine.action(ACTION_TYPE.INSERT_CASH, 200);
vendingMachine.action(ACTION_TYPE.SELECTED_PRODUCT, 1);
vendingMachine.action(ACTION_TYPE.SELECTED_PRODUCT, 1);
vendingMachine.action(ACTION_TYPE.SELECTED_PRODUCT, 2);
vendingMachine.action(ACTION_TYPE.RETURN_CASH);


// 카드 정상 결제
// vendingMachine.action(ACTION_TYPE.INSERT_CARD, { number: '1252-1251-2152-1251', cardType: 'SAMSUNG' })
// vendingMachine.action(ACTION_TYPE.SELECTED_PRODUCT, 1)
// setTimeout(() => vendingMachine.action(ACTION_TYPE.SELECTED_PRODUCT, 1), 2000)
// setTimeout(() => vendingMachine.action(ACTION_TYPE.REMOVE_CARD), 4000)
