const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class DeleteUserRouter {
  async route () {
    return HttpResponse.serverError()
  }
}

describe('DeleteUserRouter', function () {
  it('should return 500 if no DeleteUserRepository is provided', async function () {
    const sut = new DeleteUserRouter()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })
})
