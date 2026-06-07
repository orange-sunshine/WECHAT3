module.exports = class extends think.Logic {
  indexAction() {

  }

  loginAction() {
    this.allowMethods = 'post';
    this.rules = {
      username: { required: true, string: true },
      password: { required: true, string: true }
    };
  }

  registerAction() {
    this.allowMethods = 'post';
    this.rules = {
      username: { required: true, string: true },
      password: { required: true, string: true }
    };
  }
};
