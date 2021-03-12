const HttpResponse = require('../../../../utils/presentation/helpers/http-response')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

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
  }
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const encrypter = makeEncrypterSpy(

  )
  const sut = new LoginRouter(loadUserByEmailRepositorySpy, encrypter)
  return { sut, loadUserByEmailRepositorySpy }
}

function makeLoadUserByEmailRepositorySpy () {
  class LoadUserByEmailRepoSpy {
    async load (email) {

    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepoSpy()

  return loadUserByEmailRepositorySpy
}

function makeEncrypterSpy () {
  class EncrypterSpy {
    async compare (email) {

    }
  }

  const encrypterSpy = new EncrypterSpy()

  return encrypterSpy
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
})
