const HttpResponse = require('../../../../utils/presentation/helpers/http-response')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const NotFound = require('../../../../utils/presentation/errors/not-found-error')

class LoginRouter {
  constructor (loadUserByEmailRepository, encrypter, generateAccessTokenRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.generateAccessTokenRepository = generateAccessTokenRepository
  }

  async route (email, password) {
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'))
    }

    if (!this.loadUserByEmailRepository) {
      return HttpResponse.serverError()
    }

    if (!this.encrypter) {
      return HttpResponse.serverError()
    }

    if (!this.generateAccessTokenRepository) {
      return HttpResponse.serverError()
    }

    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return HttpResponse.notFound(new NotFound('user'))
    }

    const isEqual = await this.encrypter.compare(password, user.password)
    if (!isEqual) {
      return HttpResponse.badRequest(new Error('password is wrong'))
    }

    const accessToken = await this.generateAccessTokenRepository.sign(user._id)
    return HttpResponse.ok({ token: accessToken })
  }
}

module.exports = LoginRouter
