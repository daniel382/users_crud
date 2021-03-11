const HttpResponse = require('../../../../utils/presentation/helpers/http-response')

class ListUsersRouter {
  constructor (listUsersRepository) {
    this.listUsersRepository = listUsersRepository
  }

  async route (httpRequest) {
    if (!this.listUsersRepository) {
      return HttpResponse.serverError()
    }

    if (!this.listUsersRepository.list) {
      return HttpResponse.serverError()
    }

    return HttpResponse.ok([])
  }
}

function makeSut () {
  const listUsersRepositorySpy = makeListUsersRepositorySpy()

  const sut = new ListUsersRouter(listUsersRepositorySpy)
  return { sut, listUsersRepositorySpy }
}

function makeListUsersRepositorySpy () {
  class ListUsersRepositorySpy {
    async list () {

    }
  }

  const listUsersRepositorySpy = new ListUsersRepositorySpy()
  return listUsersRepositorySpy
}

describe('ListUsersRouter', function () {
  it('should return 500 if no ListUsersRepository is provided', async function () {
    const sut = new ListUsersRouter()

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid ListUsersRepository is provided', async function () {
    const sut = new ListUsersRouter({})

    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return an empty list if no user is found', async function () {
    const { sut } = makeSut()

    const httpResponse = await sut.route()
    expect(httpResponse.body).toEqual([])
  })
})
