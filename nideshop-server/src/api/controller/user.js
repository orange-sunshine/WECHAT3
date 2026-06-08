const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  async infoAction() {
    const userInfo = await this.model('user').where({id: this.getLoginUserId()}).find();
    delete userInfo.password;
    return this.success(userInfo);
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    try {
      await new Promise((resolve, reject) => {
        fs.rename(avatar.path, avatarPath, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } catch (err) {
      return this.fail('头像保存失败');
    }

    return this.success();
  }
};
