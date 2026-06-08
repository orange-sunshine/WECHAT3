var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //模拟支付
  startPay() {
    let that = this;
    util.request(api.PayPrepayId.replace('prepay', 'mockPay'), { orderId: that.data.orderId }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=true&orderId=' + that.data.orderId,
          });
        }, 2000);
      } else {
        wx.showToast({
          title: '支付失败',
          image: '/static/images/icon_error.png',
          duration: 2000
        });
      }
    });
  }
})