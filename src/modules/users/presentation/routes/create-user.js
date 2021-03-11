const HttpResponse = require('../helpers/http-response')
const MissingParamError = require('../errors/missing-param-error')

class CreateUser {
  constructor (comparePasswordUseCase, hashPassword) {
    this.comparePasswordUseCase = comparePasswordUseCase
    this.hashPassword = hashPassword
  }

  async store (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'))
    }

    if (!repeatPassword) {
      return HttpResponse.badRequest(new MissingParamError('repeatPassword'))
    }

    if (!this.comparePasswordUseCase.compare(password, repeatPassword)) {
      return HttpResponse.badRequest(new Error('Password and repeatPassword must be equal'))
    }

    try {
      await this.hashPassword.hash(password)
    } catch (err) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = CreateUser
