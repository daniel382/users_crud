const userModel = require('../../../modules/users/domain/entity/model/user-model')
const HttpResponse = require('../helpers/http-response')

class AuthorizationMiddleware {
  constructor (userModel) {
    this.userModel = userModel
  }

  async verify (httpRequest) {
    if (!this.userModel) {
      return HttpResponse.serverError()
    }

    if (!httpRequest.headers.authorization) {
      return HttpResponse.unauthorizedError(new Error('authorization header is required'))
    }
  }
}

describe('AuthorizationMiddleware', function () {
  it('should return 500 if no userModel is provided', async function () {
    const sut = new AuthorizationMiddleware()
    const httpResponse = await sut.verify()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 401 if no auth header is provided', async function () {
    const sut = new AuthorizationMiddleware(userModel)
    const httpRequest = {
      headers: {}
    }

    const httpResponse = await sut.verify(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
