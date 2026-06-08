const Base = require('./base.js');

module.exports = class extends Base {
  async loginByWeixinAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const clientIp = this.ctx.ip;

    // 解释用户数据
    const { errno, errmsg, data: userInfo } = await this.service('weixin', 'api').login(code, fullUserInfo);
    if (errno !== 0) {
      return this.fail(errno, errmsg);
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('user').where({ weixin_openid: userInfo.openId }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('user').add({
        username: '微信用户' + think.uuid(6),
        password: '',
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        mobile: '',
        weixin_openid: userInfo.openId,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

    // 更新登录信息
    await this.model('user').where({ id: userId }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: userId });

    if (think.isEmpty(sessionKey)) {
      return this.fail('生成 token 失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }

  async loginAction() {
    const username = this.post('username');
    const password = this.post('password');
    const clientIp = this.ctx.ip;

    const user = await this.model('user').where({ username: username }).find();
    if (think.isEmpty(user)) {
      return this.fail(401, '用户名或密码不正确');
    }

    const salt = user.password_salt || '';
    if (think.md5(password + '' + salt) !== user.password) {
      return this.fail(401, '用户名或密码不正确');
    }

    await this.model('user').where({ id: user.id }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: user.id });

    if (think.isEmpty(sessionKey)) {
      return this.fail('生成 token 失败');
    }

    const userInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: user.id }).find();

    return this.success({ token: sessionKey, userInfo: userInfo });
  }

  async registerAction() {
    const username = this.post('username');
    const password = this.post('password');
    const clientIp = this.ctx.ip;

    const user = await this.model('user').where({ username: username }).find();
    if (!think.isEmpty(user)) {
      return this.fail(401, '用户名已存在');
    }

    const passwordSalt = think.uuid(8);

    const userId = await this.model('user').add({
      username: username,
      password: think.md5(password + '' + passwordSalt),
      password_salt: passwordSalt,
      register_time: parseInt(new Date().getTime() / 1000),
      register_ip: clientIp,
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp,
      mobile: '',
      avatar: '',
      gender: 0,
      nickname: username
    });

    const newUserInfo = await this.model('user').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

    const TokenSerivce = this.service('token', 'api');
    const sessionKey = await TokenSerivce.create({ user_id: userId });

    if (think.isEmpty(sessionKey)) {
      return this.fail('生成 token 失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }

  async logoutAction() {
    return this.success();
  }

  async changePasswordAction() {
    const username = this.post('username');
    const oldPassword = this.post('oldPassword');
    const password = this.post('password');

    if (think.isEmpty(username) || think.isEmpty(oldPassword) || think.isEmpty(password)) {
      return this.fail('参数不能为空');
    }

    const user = await this.model('user').where({ username: username }).find();
    if (think.isEmpty(user)) {
      return this.fail('用户不存在');
    }

    const salt = user.password_salt || '';
    if (think.md5(oldPassword + '' + salt) !== user.password) {
      return this.fail('现有密码不正确');
    }

    const passwordSalt = think.uuid(8);
    await this.model('user').where({ username: username }).update({
      password: think.md5(password + '' + passwordSalt),
      password_salt: passwordSalt
    });

    return this.success();
  }
};
