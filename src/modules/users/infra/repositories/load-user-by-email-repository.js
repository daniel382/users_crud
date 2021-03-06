const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    const result = await this.userModel.find({ email }).select('+password')
    const user = result[0]

    return user || null
  }
}

module.exports = LoadUserByEmailRepository
