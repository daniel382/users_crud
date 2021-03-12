const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class DeleteUserRouter {
  constructor (deleteUserRepository, loadUserByIdRepository) {
    this.deleteUserRepository = deleteUserRepository
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async route (httpRequest) {
    if (!this.deleteUserRepository) {
      return HttpResponse.serverError()
    }

    if (!this.deleteUserRepository.delete) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository) {
      return HttpResponse.serverError()
    }

    if (!this.loadUserByIdRepository.load) {
      return HttpResponse.serverError()
    }

    const { id } = httpRequest.params
    if (!await this.loadUserByIdRepository.load(id)) {
      return { statusCode: 404 }
    }

    await this.deleteUserRepository.delete(id)
    return { statusCode: 204 }
  }
}

function makeSut () {
  const deleteUserRepositorySpy = makeDeleteUserRepositorySpy()
  const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()

  const sut = new DeleteUserRouter(deleteUserRepositorySpy, loadUserByIdRepositorySpy)

  return { sut, deleteUserRepositorySpy, loadUserByIdRepositorySpy }
}

function makeDeleteUserRepositorySpy () {
  class DeleteUserRepositorySpy {
    async delete (id) {
      return this.isDeleted
    }
  }

  const deleteUserRepositorySpy = new DeleteUserRepositorySpy()
  deleteUserRepositorySpy.isDeleted = true
  return deleteUserRepositorySpy
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

describe('DeleteUserRouter', function () {
  it('should return 500 if no DeleteUserRepository is provided', async function () {
    const sut = new DeleteUserRouter()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid DeleteUserRepository is provided', async function () {
    const sut = new DeleteUserRouter({})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no LoadUserByIdRepository is provided', async function () {
    const deleteUserRepositorySpy = makeDeleteUserRepositorySpy()
    const sut = new DeleteUserRouter(deleteUserRepositorySpy)
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid LoadUserByIdRepository is provided', async function () {
    const deleteUserRepositorySpy = makeDeleteUserRepositorySpy()
    const sut = new DeleteUserRouter(deleteUserRepositorySpy, {})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 404 if no user is found', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: { id: 'any_user_id' }
    }

    sut.loadUserByIdRepository.user = null
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
  })

  it('should return 204 if user is successfully deleted', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: { id: 'any_user_id' }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
  })
})
