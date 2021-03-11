const jwt = require('../../../../../__mocks__/jsonwebtoken')

const GenerateAccessTokenRepository = require('./generate-access-token-repository')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')
const config = require('../../../../config/secret.json')

function makeSut () {
  const sut = new GenerateAccessTokenRepository(jwt)
  return { sut }
}

describe('GenerateAccessTokenRepository', function () {
  it('should throw if no data is provided', function () {
    const { sut } = makeSut()
    const promise = sut.sign()

    expect(promise).rejects.toThrow(new MissingParamError('data'))
  })

  it('should throw if no tokenGenerator is provided', function () {
    const sut = new GenerateAccessTokenRepository()
    const promise = sut.sign('any_data')

    expect(promise).rejects.toThrow(new MissingParamError('TokenGenerator'))
  })

  it('should throw if an invalid tokenGenerator is provided', function () {
    const invalidTokenGenerator = {}
    const sut = new GenerateAccessTokenRepository(invalidTokenGenerator)
    const promise = sut.sign('any_data')

    expect(promise).rejects.toThrow(new InvalidParamError('TokenGenerator'))
  })

  it('should call tokenGenerator with correct values', async function () {
    const { sut } = makeSut()
    await sut.sign('any_data')

    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

    expect(jwt.data).toBe('any_data')
    expect(jwt.secret).toBe(config.secret)
    expect(jwt.options).toEqual({ expiresIn: SEVEN_DAYS })
  })

  it('should return an access token', async function () {
    const { sut } = makeSut()
    const accessToken = await sut.sign('any_data')

    expect(accessToken).toBe('any_token')
  })
})
