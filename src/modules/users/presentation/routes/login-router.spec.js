const LoginRouter = require('./login-router')

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const encrypter = makeEncrypterSpy()
  const generateAccessTokenSpy = makeGenerateAccessTokenSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenSpy()

  const sut = new LoginRouter(
    loadUserByEmailRepositorySpy,
    encrypter,
    generateAccessTokenSpy,
    updateAccessTokenRepositorySpy
  )

  return { sut }
}

function makeLoadUserByEmailRepositorySpy () {
  class LoadUserByEmailRepoSpy {
    async load (email) {
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepoSpy()
  loadUserByEmailRepositorySpy.user = {
    _id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }

  return loadUserByEmailRepositorySpy
}

function makeEncrypterSpy () {
  class EncrypterSpy {
    async compare (email, hash) {
      return this.isEqual
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isEqual = true

  return encrypterSpy
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

function makeUpdateAccessTokenSpy () {
  class UpdateAccessTokenRepositorySpy {
    async update (accessToken) {
      this.accessToken = accessToken
    }
  }

  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  return updateAccessTokenRepositorySpy
}

describe('LoginRouter', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = { body: { } }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 500 if no LoadUserByEmailRepository is provided', async function () {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no Encrypter is provided', async function () {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const sut = new LoginRouter(loadUserByEmailRepositorySpy)
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no GenerateAccessTokenRepository is provided', async function () {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const encrypter = makeEncrypterSpy()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const sut = new LoginRouter(loadUserByEmailRepositorySpy, encrypter)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no UpdateAccessToken is provided', async function () {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const encrypter = makeEncrypterSpy()
    const generateAccessTokenSpy = makeGenerateAccessTokenSpy()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const sut = new LoginRouter(
      loadUserByEmailRepositorySpy,
      encrypter,
      generateAccessTokenSpy
    )

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call UpdateAccessToken with correct values', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(sut.updateAccessTokenRepository.accessToken).toBe('any_token')
  })

  it('should return 404 if no user is found', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    sut.loadUserByEmailRepository.user = null
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
  })

  it('should return 400 if user password is wrong', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    sut.encrypter.isEqual = false
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return a new access token', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ token: 'any_token' })
  })
})
