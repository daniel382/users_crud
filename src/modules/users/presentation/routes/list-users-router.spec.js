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

    const users = await this.listUsersRepository.list()
    return HttpResponse.ok(users)
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
      return this.users
    }
  }

  const listUsersRepositorySpy = new ListUsersRepositorySpy()
  listUsersRepositorySpy.users = [{
    _id: 'user01_id',
    name: 'user01',
    email: 'user01@email.com',
    password: 'user01_password'
  }]

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
    const { sut, listUsersRepositorySpy } = makeSut()

    listUsersRepositorySpy.users = []
    const httpResponse = await sut.route()
    expect(httpResponse.body).toEqual([])
  })

  it('should return a list of users', async function () {
    const { sut, listUsersRepositorySpy } = makeSut()

    const httpResponse = await sut.route()
    expect(httpResponse.body).toEqual(listUsersRepositorySpy.users)
  })
})
