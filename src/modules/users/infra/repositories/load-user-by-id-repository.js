const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class LoadUserByIdRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    const user = await this.userModel.findById(id)
    return user || null
  }
}

module.exports = LoadUserByIdRepository
