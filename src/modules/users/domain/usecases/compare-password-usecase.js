const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class ComparePasswordUseCase {
  compare (password, repeatPassword) {
    if (!password) {
      throw new MissingParamError('password')
    }

    if (!repeatPassword) {
      throw new MissingParamError('repeatPassword')
    }

    return password === repeatPassword
  }
}

module.exports = ComparePasswordUseCase
