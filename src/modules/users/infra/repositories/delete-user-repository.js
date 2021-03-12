const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class DeleteUserRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async delete (id) {
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    return Boolean(await this.userModel.findByIdAndDelete(id))
  }
}

module.exports = DeleteUserRepository
