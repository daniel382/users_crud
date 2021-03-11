const HttpResponse = require('../helpers/http-response')
const MissingParamError = require('../errors/missing-param-error')

class CreateUser {
  constructor (
    comparePasswordUseCase,
    hashPassword,
    createUserRepository,
    loadUserByEmailRepository
  ) {
    this.comparePasswordUseCase = comparePasswordUseCase
    this.hashPassword = hashPassword
    this.createUserRepository = createUserRepository
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async store (httpRequest) {
    const { name, email, password, repeatPassword } = httpRequest.body

    if (!name) {
      return HttpResponse.badRequest(new MissingParamError('name'))
    }

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

    if (await this.loadUserByEmailRepository.load(email)) {
      return HttpResponse.badRequest(new Error('Email already exists'))
    }

    try {
      const hashedPassword = await this.hashPassword.hash(password)
      const user = {
        name,
        email,
        password: hashedPassword
      }

      const newUser = await this.createUserRepository.save(user)

      return HttpResponse.ok(newUser)
      //
    } catch (err) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = CreateUser
