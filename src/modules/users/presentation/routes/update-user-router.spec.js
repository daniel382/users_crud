const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class UpdateUserRouter {
  constructor (loadUserByIdRepository, updateUserByIdRepository) {
    this.loadUserByIdRepository = loadUserByIdRepository
    this.updateUserByIdRepository = updateUserByIdRepository
  }

  async route (httpRequest) {
    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    if (!this.updateUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.updateUserByIdRepository.update) {
      return HttpResponse.serverError()
    }

    const { id } = httpRequest.params
    await this.loadUserByIdRepository.load(id)
  }
}

function makeSut () {
  const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()
  const updateUserByIdRepositorySpy = makeUpdateUserByIdRepositorySpy()

  const sut = new UpdateUserRouter(loadUserByIdRepositorySpy, updateUserByIdRepositorySpy)
  return { sut, loadUserByIdRepositorySpy, updateUserByIdRepositorySpy }
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

function makeUpdateUserByIdRepositorySpy () {
  class UpdateUserByIdRepositorySpy {
    async update (id) {
      this.id = id
      return this.user
    }
  }

  const updateUserByIdRepositorySpy = new UpdateUserByIdRepositorySpy()

  return updateUserByIdRepositorySpy
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

  it('should return 500 if an invalid UpdateUserByIdRepository is provided', async function () {
    const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()
    const sut = new UpdateUserRouter(loadUserByIdRepositorySpy, {})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call LoadUserByIdRepository with correct values', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: { id: 'any_id' }
    }

    await sut.route(httpRequest)

    expect(sut.loadUserByIdRepository.id).toBe('any_id')
  })
})
