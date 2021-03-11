class CreateUser {
  constructor (comparePasswordUseCase) {
    this.comparePasswordUseCase = comparePasswordUseCase
  }

  async store (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body

    if (!email || !password || !repeatPassword) {
      return { statusCode: 400 }
    }

    if (!this.comparePasswordUseCase.compare(password, repeatPassword)) {
      return { statusCode: 400 }
    }
  }
}

module.exports = CreateUser
