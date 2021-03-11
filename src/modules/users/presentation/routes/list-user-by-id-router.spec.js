const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUserByIdRouter {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async route (httpRequest) {
    if (!this.loadUserByEmailRepository) {
      return HttpResponse.serverError()
    }

    const { params: { id } } = httpRequest
    if (!id) {
      return HttpResponse.badRequest(new MissingParamError('id'))
    }

    return HttpResponse.ok([])
  }
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByIdRepositorySpy()

  const sut = new ListUserByIdRouter(loadUserByEmailRepositorySpy)
  return { sut, loadUserByEmailRepositorySpy }
}

function makeLoadUserByIdRepositorySpy () {
  class LoadUserByIdRepositorySpy {
    async load (id) {

    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByIdRepositorySpy()
  return loadUserByEmailRepositorySpy
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

  it('shoud return 500 if no LoadUserByIdRepository is provided', async function () {
    const sut = new ListUserByIdRouter()
    const httpRequest = {
      params: {
        id: 'no_registered_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
})
