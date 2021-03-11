const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUsersRouter {
  async route (httpRequest) {
    return HttpResponse.serverError()
  }
}

describe('ListUsersRouter', function () {
  it('should return 500 if no ListUsersRepository is provided', async function () {
    const sut = new ListUsersRouter()

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
})
