const HttpResponse = require('../helpers/http-response')

class CreateUser {
  constructor (comparePasswordUseCase, hashPassword) {
    this.comparePasswordUseCase = comparePasswordUseCase
    this.hashPassword = hashPassword
  }

  async store (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body

    if (!email || !password || !repeatPassword) {
      return HttpResponse.badRequest(new Error('Missing param'))
    }

    if (!this.comparePasswordUseCase.compare(password, repeatPassword)) {
      return HttpResponse.badRequest(new Error('Invalid param'))
    }

    this.hashPassword.hash(password)
  }
}

module.exports = CreateUser
