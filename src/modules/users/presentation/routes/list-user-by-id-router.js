const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUserByIdRouter {
  constructor (loadUserByIdRepository) {
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async route (httpRequest) {
    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    const { params: { id } } = httpRequest
    if (!id) {
      return HttpResponse.badRequest(new MissingParamError('id'))
    }

    const user = await this.loadUserByIdRepository.load(id)

    if (!user) {
      return HttpResponse.ok({ msg: 'User not found' })
    }

    return HttpResponse.ok(user)
  }
}

module.exports = ListUserByIdRouter
