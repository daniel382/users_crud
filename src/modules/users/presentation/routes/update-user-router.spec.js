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

    const { params: { id }, body } = httpRequest
    if (!await this.loadUserByIdRepository.load(id)) {
      return { statusCode: 404 }
    }

    await this.updateUserByIdRepository.update(id, body)
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
    async update (id, user) {
      this.id = id
      this.user = user

      return this.newUser
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

  it('should return 404 if no user is found', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: { id: 'any_id' }
    }

    sut.loadUserByIdRepository.user = null
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
  })

  it('should call UpdateUserByIdRepository with correct values', async function () {
    const { sut } = makeSut()
    const fakeUser = {
      name: 'new_user_name',
      email: 'new_user_email',
      password: 'new_user_password'
    }

    const httpRequest = {
      params: { id: 'any_id' },
      body: fakeUser
    }

    await sut.route(httpRequest)

    expect(sut.updateUserByIdRepository.id).toBe('any_id')
    expect(sut.updateUserByIdRepository.user).toEqual(fakeUser)
  })
})
