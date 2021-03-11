class CreateUser {
  constructor (comparePasswordUseCase, hashPassword) {
    this.comparePasswordUseCase = comparePasswordUseCase
    this.hashPassword = hashPassword
  }

  async store (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body

    if (!email || !password || !repeatPassword) {
      return { statusCode: 400 }
    }

    if (!this.comparePasswordUseCase.compare(password, repeatPassword)) {
      return { statusCode: 400 }
    }

    this.hashPassword.hash(password)
  }
}

module.exports = CreateUser
