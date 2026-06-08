var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    try {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('userInfo'))
      });
    } catch (e) {}
  },
  onChangePassword: function () {
    wx.navigateTo({
      url: '/pages/auth/reset/reset',
    });
  },
  onLogout: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
})
