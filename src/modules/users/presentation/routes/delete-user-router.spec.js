const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class DeleteUserRouter {
  constructor (deleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }

  async route () {
    if (!this.deleteUserRepository) {
      return HttpResponse.serverError()
    }

    if (!this.deleteUserRepository.delete) {
      return HttpResponse.serverError()
    }
  }
}

describe('DeleteUserRouter', function () {
  it('should return 500 if no DeleteUserRepository is provided', async function () {
    const sut = new DeleteUserRouter()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid DeleteUserRepository is provided', async function () {
    const sut = new DeleteUserRouter({})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })
})
