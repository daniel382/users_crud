const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')

class ListUsersRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async list (page, limit) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    if (!page && page !== 0) {
      throw new MissingParamError('page')
    }

    if (!limit && limit !== 0) {
      throw new MissingParamError('limit')
    }

    if (page < 0) {
      throw new InvalidParamError('page')
    }

    if (limit <= 0) {
      throw new InvalidParamError('limit')
    }

    return await this.userModel
      .find()
      .skip(page * limit)
      .limit(limit)
  }
}

module.exports = ListUsersRepository
