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

    if (!this.loadUserByEmailRepository.load) {
      return HttpResponse.serverError()
    }

    const { params: { id } } = httpRequest
    if (!id) {
      return HttpResponse.badRequest(new MissingParamError('id'))
    }

    const user = await this.loadUserByEmailRepository.load(id)

    if (!user) {
      return HttpResponse.ok({ msg: 'User not found' })
    }

    return HttpResponse.ok(user)
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
      this.id = id
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByIdRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    _id: 'any_id'
  }

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

  it('shoud return an message if no user is found', async function () {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'no_registered_id'
      }
    }

    loadUserByEmailRepositorySpy.user = null
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ msg: 'User not found' })
  })

  it('shoud return 500 if no LoadUserByIdRepository is provided', async function () {
    const sut = new ListUserByIdRouter()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('shoud return 500 if an invalid LoadUserByIdRepository is provided', async function () {
    const sut = new ListUserByIdRouter({})
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('shoud call LoadUserByIdRepository with correct values', async function () {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    await sut.route(httpRequest)

    expect(loadUserByEmailRepositorySpy.id).toBe('any_id')
  })

  it('shoud return an user if it is found', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body._id).toBe('any_id')
  })
})
