const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class DeleteUserRouter {
  constructor (deleteUserRepository, loadUserByIdRepository) {
    this.deleteUserRepository = deleteUserRepository
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async route () {
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
  }
}

function makeDeleteUserRepositorySpy () {
  class DeleteUserRepositorySpy {
    async delete (id) {

    }
  }

  const deleteUserRepositorySpy = new DeleteUserRepositorySpy()
  return deleteUserRepositorySpy
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
})
