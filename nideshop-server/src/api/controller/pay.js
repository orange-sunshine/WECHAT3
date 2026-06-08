/* eslint-disable no-multi-spaces */
const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取支付的请求参数
   * @returns {Promise<PreventPromise|void|Promise>}
   */
  async prepayAction() {
    const orderId = this.get('orderId');

    const orderInfo = await this.model('order').where({ id: orderId }).find();
    if (think.isEmpty(orderInfo)) {
      return this.fail(400, '订单已取消');
    }
    if (parseInt(orderInfo.pay_status) !== 0) {
      return this.fail(400, '订单已支付，请不要重复操作');
    }
    const openid = await this.model('user').where({ id: orderInfo.user_id }).getField('weixin_openid', true);
    if (think.isEmpty(openid)) {
      return this.fail('微信支付失败 openid empty');
    }
    const WeixinSerivce = this.service('weixin', 'api');
    try {
      const returnParams = await WeixinSerivce.createUnifiedOrder({
        openid: openid,
        body: '订单编号：' + orderInfo.order_sn,
        out_trade_no: orderInfo.order_sn,
        total_fee: parseInt(orderInfo.actual_price * 100),
        spbill_create_ip: ''
      });
      return this.success(returnParams);
    } catch (err) {
      // 开发环境：微信配置为空时返回模拟参数
      const timeStamp = parseInt(Date.now() / 1000) + '';
      const nonceStr = 'mock_' + parseInt(Math.random() * 1000000);
      const returnParams = {
        appid: think.config('weixin.appid'),
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: 'prepay_id=mock_' + orderInfo.order_sn,
        signType: 'MD5',
        paySign: 'mock_' + parseInt(Math.random() * 1000000)
      };
      return this.success(returnParams);
    }
  }

  async mockPayAction() {
    const orderId = this.post('orderId');
    const orderInfo = await this.model('order').where({ id: orderId }).find();
    if (think.isEmpty(orderInfo)) {
      return this.fail('订单不存在');
    }
    await this.model('order').where({ id: orderId }).update({
      pay_status: 2,
      order_status: 201,
      pay_time: parseInt(Date.now() / 1000)
    });
    return this.success();
  }

  async notifyAction() {
    const WeixinSerivce = this.service('weixin', 'api');
    const result = WeixinSerivce.payNotify(this.post('xml'));
    if (!result) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
    }

    const orderModel = this.model('order');
    const orderInfo = await orderModel.getOrderByOrderSn(result.out_trade_no);
    if (think.isEmpty(orderInfo)) {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
    }

    if (await orderModel.updatePayStatus(orderInfo.id, 2)) {
    } else {
      return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[订单不存在]]></return_msg></xml>`;
    }

    return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
  }
};
