/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(orderId) {
  return new Promise(function (resolve, reject) {
    util.request(api.PayPrepayId.replace('prepay', 'mockPay'), { orderId: orderId }, 'POST').then((res) => {
      if (res.errno === 0) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
}


module.exports = {
  payOrder,
};











