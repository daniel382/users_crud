const ListUserByIdRouter = require('./list-user-by-id-router')

function makeSut () {
  const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()

  const sut = new ListUserByIdRouter(loadUserByIdRepositorySpy)
  return { sut, loadUserByIdRepositorySpy }
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

describe('ListUsersRouter', function () {
  it('shoud return 400 if no id param is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      params: {}
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  it('shoud return a message if no user is found', async function () {
    const { sut, loadUserByIdRepositorySpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'no_registered_id'
      }
    }

    loadUserByIdRepositorySpy.user = null
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
    const { sut, loadUserByIdRepositorySpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }

    await sut.route(httpRequest)

    expect(loadUserByIdRepositorySpy.id).toBe('any_id')
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
