const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class UpdateUserRouter {
  constructor (loadUserByIdRepository, updateUserByIdRepository) {
    this.loadUserByIdRepository = loadUserByIdRepository
    this.updateUserByIdRepository = updateUserByIdRepository
  }

  async route () {
    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    if (!this.updateUserByIdRepository) {
      return HttpResponse.serverError()
    }
  }
}

function makeLoadUserByIdRepositorySpy () {
  class LoadUserByIdRepositorySpy {
    async load (id) {
      this.id = id
      return this.user
    }
  }

  const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy()
  loadUserByIdRepositorySpy.user = {
    _id: 'any_id'
  }
  return loadUserByIdRepositorySpy
}

describe('UpdateUserRouter', function () {
  it('should return 500 if no LoadUserByIdRepository is provided', async function () {
    const sut = new UpdateUserRouter()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid LoadUserByIdRepository is provided', async function () {
    const sut = new UpdateUserRouter({})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no UpdateUserByIdRepository is provided', async function () {
    const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()
    const sut = new UpdateUserRouter(loadUserByIdRepositorySpy)
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })
})
