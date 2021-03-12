const HttpResponse = require('../../../../utils/presentation/helpers/http-response')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const NotFound = require('../../../../utils/presentation/errors/not-found-error')

class LoginRouter {
  constructor (loadUserByEmailRepository, encrypter, generateAccessTokenRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.generateAccessTokenRepository = generateAccessTokenRepository
  }

  async route (email, password) {
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'))
    }

    if (!this.loadUserByEmailRepository) {
      return HttpResponse.serverError()
    }

    if (!this.encrypter) {
      return HttpResponse.serverError()
    }

    if (!this.generateAccessTokenRepository) {
      return HttpResponse.serverError()
    }

    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return HttpResponse.notFound(new NotFound('user'))
    }

    const isEqual = await this.encrypter.compare(password, user.password)
    if (!isEqual) {
      return HttpResponse.badRequest(new Error('password is wrong'))
    }
  }
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const encrypter = makeEncrypterSpy()
  const generateAccessTokenSpy = makeGenerateAccessTokenSpy()

  const sut = new LoginRouter(loadUserByEmailRepositorySpy, encrypter, generateAccessTokenSpy)
  return { sut, loadUserByEmailRepositorySpy, generateAccessTokenSpy }
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

describe('LoginRouter', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route('any@email.com')

    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 500 if no LoadUserByEmailRepository is provided', async function () {
    const sut = new LoginRouter()
    const httpResponse = await sut.route('any@email.com', 'any_password')

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no Encrypter is provided', async function () {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const sut = new LoginRouter(loadUserByEmailRepositorySpy)

    const httpResponse = await sut.route('any@email.com', 'any_password')

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no GenerateAccessTokenRepository is provided', async function () {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const encrypter = makeEncrypterSpy()

    const sut = new LoginRouter(loadUserByEmailRepositorySpy, encrypter)

    const httpResponse = await sut.route('any@email.com', 'any_password')

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 404 if no user is found', async function () {
    const { sut } = makeSut()

    sut.loadUserByEmailRepository.user = null
    const httpResponse = await sut.route('any@email.com', 'any_password')

    expect(httpResponse.statusCode).toBe(404)
  })

  it('should return 400 if user password is wrong', async function () {
    const { sut } = makeSut()

    sut.encrypter.isEqual = false
    const httpResponse = await sut.route('any@email.com', 'wrong_password')

    expect(httpResponse.statusCode).toBe(400)
  })
})
