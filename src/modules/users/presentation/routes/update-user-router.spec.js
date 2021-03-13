const UpdateUserRouter = require('./update-user-router')

function makeSut () {
  const loadUserByIdRepositorySpy = makeLoadUserByIdRepositorySpy()
  const updateUserByIdRepositorySpy = makeUpdateUserByIdRepositorySpy()
  const encrypter = makeHashPassword()

  const sut = new UpdateUserRouter(
    loadUserByIdRepositorySpy,
    updateUserByIdRepositorySpy,
    encrypter
  )

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
  updateUserByIdRepositorySpy.newUser = {
    name: 'updated_user_name',
    email: 'updated_user_email',
    password: 'updated_user_password'
  }

  return updateUserByIdRepositorySpy
}

function makeHashPassword () {
  class HashPasswordSpy {
    async hash (password) {
      this.password = password
      return 'any_hashed_password'
    }
  }

  const hashPasswordSpy = new HashPasswordSpy()

  return hashPasswordSpy
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
      params: { id: 'any_id' },
      body: {}
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

  it('should return 200 when user is updated', async function () {
    const { sut } = makeSut()
    const newUser = {
      name: 'updated_user_name',
      email: 'updated_user_email',
      password: 'updated_user_password'
    }

    const httpRequest = {
      params: { id: 'any_id' },
      body: {
        name: 'user_name',
        email: 'user_email',
        password: 'user_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(newUser)
  })
})
