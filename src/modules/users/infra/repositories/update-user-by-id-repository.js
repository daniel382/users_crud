const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class UpdateUserByIdRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (id, user) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    if (!id) {
      throw new MissingParamError('id')
    }

    if (!user) {
      throw new MissingParamError('user')
    }

    return await this.userModel.findByIdAndUpdate(id, user, { new: true })
  }
}

module.exports = UpdateUserByIdRepository
