const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class UpdateUserRouter {
  constructor (loadUserByIdRepository, updateUserByIdRepository, encrypter) {
    this.loadUserByIdRepository = loadUserByIdRepository
    this.updateUserByIdRepository = updateUserByIdRepository
    this.encrypter = encrypter
  }

  async route (httpRequest) {
    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    if (!this.updateUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.updateUserByIdRepository.update) {
      return HttpResponse.serverError()
    }

    const { params: { id }, body } = httpRequest
    if (!await this.loadUserByIdRepository.load(id)) {
      return { statusCode: 404 }
    }

    if (body.password) {
      body.password = await this.encrypter.hash(body.password)
    }

    const user = await this.updateUserByIdRepository.update(id, body)
    return HttpResponse.ok(user)
  }
}

module.exports = UpdateUserRouter
