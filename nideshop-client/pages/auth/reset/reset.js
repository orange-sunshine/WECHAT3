var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    username: '',
    oldPassword: '',
    password: '',
    confirmPassword: ''
  },
  bindUsernameInput: function(e) {
    this.setData({ username: e.detail.value });
  },
  bindOldPasswordInput: function(e) {
    this.setData({ oldPassword: e.detail.value });
  },
  bindPasswordInput: function(e) {
    this.setData({ password: e.detail.value });
  },
  bindConfirmPasswordInput: function(e) {
    this.setData({ confirmPassword: e.detail.value });
  },
  submit: function() {
    var that = this;
    if (!that.data.username || !that.data.oldPassword || !that.data.password || !that.data.confirmPassword) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    if (that.data.password !== that.data.confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({ title: '提交中...' });
    util.request(api.AuthRegister.replace('register', 'changePassword'), {
      username: that.data.username,
      oldPassword: that.data.oldPassword,
      password: that.data.password
    }, 'POST').then(function(res) {
      wx.hideLoading();
      if (res.errno === 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function() {
          wx.navigateBack();
        }, 2000);
      } else {
        wx.showToast({
          title: res.errmsg || '修改失败',
          icon: 'none'
        });
      }
    });
  }
})
