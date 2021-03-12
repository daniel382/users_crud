const HttpResponse = require('../../../../utils/presentation/helpers/http-response')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class LoginRouter {
  async route () {
    return HttpResponse.badRequest(new MissingParamError('email'))
  }
}

function makeSut () {
  const sut = new LoginRouter()
  return { sut }
}

describe('LoginRouter', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(400)
  })
})
