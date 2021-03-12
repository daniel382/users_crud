const HttpResponse = require('../helpers/http-response')

class AutorizationMiddleware {
  async verify () {
    return HttpResponse.serverError()
  }
}

describe('AuthorizationMiddleware', function () {
  it('should return 500 if no userModel is provided', async function () {
    const sut = new AutorizationMiddleware()
    const httpRequest = await sut.verify()

    expect(httpRequest.statusCode).toBe(500)
  })
})
