const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')
const config = require('../../../../config/secret.json')

class GenerateAccessTokenRepository {
  constructor (tokenGenerator) {
    this.tokenGenerator = tokenGenerator
  }

  async sign (data) {
    if (!data) {
      throw new MissingParamError('data')
    }

    if (!this.tokenGenerator) {
      throw new MissingParamError('TokenGenerator')
    }

    if (!this.tokenGenerator.sign) {
      throw new InvalidParamError('TokenGenerator')
    }

    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

    return this.tokenGenerator.sign(data, config.secret, {
      expiresIn: SEVEN_DAYS
    })
  }
}

module.exports = GenerateAccessTokenRepository
