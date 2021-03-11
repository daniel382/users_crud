const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUserByIdRouter {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async route (httpRequest) {
    if (!this.loadUserByEmailRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByEmailRepository.load) {
      return HttpResponse.serverError()
    }

    const { params: { id } } = httpRequest
    if (!id) {
      return HttpResponse.badRequest(new MissingParamError('id'))
    }

    const user = await this.loadUserByEmailRepository.load(id)

    if (!user) {
      return HttpResponse.ok({ msg: 'User not found' })
    }

    return HttpResponse.ok(user)
  }
}

module.exports = ListUserByIdRouter
