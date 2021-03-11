const ListUserByIdRouter = require('./list-user-by-id-router')

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
