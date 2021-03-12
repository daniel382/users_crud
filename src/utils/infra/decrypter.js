const MissingParamError = require('../presentation/errors/missing-param-error')

class Decrypter {
  constructor (crypter) {
    this.crypter = crypter
  }

  async compare (password, hash) {
    if (!password) {
      throw new MissingParamError('password')
    }

    if (!hash) {
      throw new MissingParamError('hash')
    }

    if (!this.crypter) {
      throw new MissingParamError('crypter')
    }

    return await this.crypter.compare(password, hash)
  }
}

module.exports = Decrypter
