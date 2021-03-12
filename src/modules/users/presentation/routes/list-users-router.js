const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUsersRouter {
  constructor (listUsersRepository) {
    this.listUsersRepository = listUsersRepository
  }

  async route (httpRequest) {
    if (!this.listUsersRepository) {
      return HttpResponse.serverError()
    }

    if (!this.listUsersRepository.list) {
      return HttpResponse.serverError()
    }

    const page = (httpRequest.query.page - 1) || 0
    const limit = (httpRequest.query.limit) || 10

    const users = await this.listUsersRepository.list(page, limit)

    return HttpResponse.ok(users)
  }
}

module.exports = ListUsersRouter
