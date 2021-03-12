const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class DeleteUserRouter {
  constructor (deleteUserRepository, loadUserByIdRepository) {
    this.deleteUserRepository = deleteUserRepository
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async route (httpRequest) {
    if (!this.deleteUserRepository) {
      return HttpResponse.serverError()
    }

    if (!this.deleteUserRepository.delete) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    const { id } = httpRequest.params
    if (!await this.loadUserByIdRepository.load(id)) {
      return { statusCode: 404 }
    }

    await this.deleteUserRepository.delete(id)
    return { statusCode: 204 }
  }
}

module.exports = DeleteUserRouter
