const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (id, accessToken) {
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!accessToken) {
      throw new MissingParamError('AccessToken')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    await this.userModel.findByIdAndUpdate(id, { token: accessToken })
  }
}

module.exports = UpdateAccessTokenRepository
