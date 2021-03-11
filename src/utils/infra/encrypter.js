const MissingParamError = require('../../modules/users/presentation/errors/missing-param-error')

class Encrypter {
  constructor (crypter) {
    this.crypter = crypter
  }

  async hash (password) {
    if (!password) {
      throw new MissingParamError('password')
    }

    return await this.crypter.hash(password, 10)
  }
}

module.exports = Encrypter
