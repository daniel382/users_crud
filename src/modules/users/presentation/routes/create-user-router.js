const HttpResponse = require('../../../../utils/presentation/helpers/http-response')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class CreateUserRouter {
  constructor (
    comparePasswordUseCase,
    hashPassword,
    createUserRepository,
    loadUserByEmailRepository,
    generateAccessTokenRepository,
    updateAccessTokenRepository
  ) {
    this.comparePasswordUseCase = comparePasswordUseCase
    this.hashPassword = hashPassword
    this.createUserRepository = createUserRepository
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.generateAccessTokenRepository = generateAccessTokenRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async route (httpRequest) {
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

    try {
      if (await this.loadUserByEmailRepository.load(email)) {
        return HttpResponse.badRequest(new Error('Email already exists'))
      }

      const hashedPassword = await this.hashPassword.hash(password)
      const user = {
        name,
        email,
        password: hashedPassword
      }

      const newUser = await this.createUserRepository.save(user)

      const token = await this.generateAccessTokenRepository.sign({ id: newUser._id })
      await this.updateAccessTokenRepository.update(newUser._id, token)

      const response = {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          __v: newUser.__v
        },
        token
      }

      return HttpResponse.ok(response)
      //
    } catch (err) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = CreateUserRouter
