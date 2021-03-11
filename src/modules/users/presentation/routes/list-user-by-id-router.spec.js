const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUserByIdRouter {
  async route (httpRequest) {
    const { params: { id } } = httpRequest
    if (!id) {
      return HttpResponse.badRequest(new MissingParamError('id'))
    }

    return HttpResponse.ok([])
  }
}

function makeSut () {
  const sut = new ListUserByIdRouter()
  return { sut }
}

describe('ListUsersRouter', function () {
  it('shoud return 400 if no id param is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: {}
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  it('shoud return an empty list if no user is found', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: {
        id: 'no_registered_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([])
  })
})
