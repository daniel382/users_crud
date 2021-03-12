const CreateUserRouter = require('./create-user-router')

function makeSut () {
  const comparePasswordUseCaseSpy = makeComparePasswordUseCaseSpy()
  const hashPasswordSpy = makeHashPassword()
  const createUserRepoSpy = makeCreateUserRepository()
  const loadUserByEmailRepoSpy = makeLoadUserByEmailRepositorySpy()
  const generateAccessTokenSpy = makeGenerateAccessTokenSpy()

  const sut = new CreateUserRouter(
    comparePasswordUseCaseSpy,
    hashPasswordSpy,
    createUserRepoSpy,
    loadUserByEmailRepoSpy,
    generateAccessTokenSpy
  )

  return {
    sut,
    comparePasswordUseCaseSpy,
    hashPasswordSpy,
    createUserRepoSpy,
    loadUserByEmailRepoSpy,
    generateAccessTokenSpy
  }
}

function makeComparePasswordUseCaseSpy () {
  class ComparePasswordUseCaseSpy {
    compare (password, repeatPassword) {
      this.password = password
      this.repeatPassword = repeatPassword

      return this.isEqual
    }
  }

  const comparePasswordUseCaseSpy = new ComparePasswordUseCaseSpy()
  comparePasswordUseCaseSpy.isEqual = true
  return comparePasswordUseCaseSpy
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

function makeCreateUserRepository () {
  class CreateUserRepositorySpy {
    async save (user) {
      this.user = user
      user._id = 'any_id'
      return user
    }
  }

  const createUserRepoSpy = new CreateUserRepositorySpy()

  return createUserRepoSpy
}

function makeLoadUserByEmailRepositorySpy () {
  class LoadUserByEmailRepoSpy {
    async load (email) {
      return this.alreadyExists
    }
  }

  const loadUserByEmailRepoSpy = new LoadUserByEmailRepoSpy()
  loadUserByEmailRepoSpy.alreadyExists = false

  return loadUserByEmailRepoSpy
}

function makeHashPasswordWithThrow () {
  class HashPasswordSpyWithThrow {
    async hash (password) {
      throw new Error('')
    }
  }

  const hashPasswordSpy = new HashPasswordSpyWithThrow()

  return hashPasswordSpy
}

function makeGenerateAccessTokenSpy () {
  class GenerateAccessTokenSpy {
    async sign (data) {
      this.userId = data
      return this.token
    }
  }

  const generateAccessTokenSpy = new GenerateAccessTokenSpy()
  generateAccessTokenSpy.token = 'any_token'
  return generateAccessTokenSpy
}

function makeCreateUserRepositoryWithThrow () {
  class CreateUserRepositorySpyWithThrow {
    async save (user) {
      throw new Error('')
    }
  }

  const createUserRepoSpy = new CreateUserRepositorySpyWithThrow()

  return createUserRepoSpy
}

function makeLoadUserByEmailRepositoryWithThrow () {
  class LoadUserByEmailRepositoryWithThrow {
    async load (email) {
      throw new Error('')
    }
  }

  return new LoadUserByEmailRepositoryWithThrow()
}

describe('Create User', function () {
  it('should return 400 if no name is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no repeatPassword is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if password and repeatPassword are not equal', async function () {
    const { sut, comparePasswordUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'other_password'
      }
    }

    comparePasswordUseCaseSpy.isEqual = false
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if email already exists', async function () {
    const { sut, loadUserByEmailRepoSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_duplicated_email',
        password: 'any_password',
        repeatPassword: 'other_password'
      }
    }

    loadUserByEmailRepoSpy.alreadyExists = true

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 500 if LoadUserByEmailRepoitory throws', async function () {
    const { sut } = makeSut()

    sut.loadUserByEmailRepository = makeLoadUserByEmailRepositoryWithThrow()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call ComparePasswordUseCase with correct values', async function () {
    const { sut, comparePasswordUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(comparePasswordUseCaseSpy.password).toBe('any_password')
    expect(comparePasswordUseCaseSpy.repeatPassword).toBe('any_password')
  })

  it('should call HashPassword with correct values', async function () {
    const { sut, hashPasswordSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(hashPasswordSpy.password).toBe('any_password')
  })

  it('should return 500 if HashPassword throws', async function () {
    const { sut } = makeSut()
    const hashPasswordSpy = makeHashPasswordWithThrow()

    sut.hashPassword = hashPasswordSpy

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call CreateUserRepository with correct values', async function () {
    const { sut, createUserRepoSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const user = {
      _id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_hashed_password'
    }

    await sut.route(httpRequest)

    expect(createUserRepoSpy.user).toEqual(user)
  })

  it('should return 500 if CreateUserRepository throws', async function () {
    const { sut } = makeSut()
    const createUserRepoSpy = makeCreateUserRepositoryWithThrow()

    sut.createUserRepository = createUserRepoSpy

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 200 if the user is successfully created', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const newUser = {
      user: {
        _id: 'any_id',
        name: 'any_name',
        email: 'any_email'
      },
      token: 'any_token'
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(newUser)
  })

  it('should call GenerateAccessToken with correct values', async function () {
    const { sut, generateAccessTokenSpy } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    await sut.route(httpRequest)
    expect(generateAccessTokenSpy.userId).toEqual({ id: 'any_id' })
  })

  it('should return an access token', async function () {
    const { sut, generateAccessTokenSpy } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
    expect(httpResponse.body.token).toBe(generateAccessTokenSpy.token)
  })
})
