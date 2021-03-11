const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')

class CreateUserRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async save (user) {
    if (!user) {
      throw new MissingParamError('user')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    const { name, email, password } = user
    if (!name || !email || !password) {
      throw new InvalidParamError('user')
    }

    return await this.userModel.create({
      name,
      email,
      password
    })
  }
}

module.exports = CreateUserRepository
