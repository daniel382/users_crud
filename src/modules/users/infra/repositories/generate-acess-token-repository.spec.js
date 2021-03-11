const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')

class GenerateAccessTokenRepository {
  constructor (tokenGenerator) {
    this.tokenGenerator = tokenGenerator
  }

  async sign (data) {
    if (!data) {
      throw new MissingParamError('data')
    }

    if (!this.tokenGenerator) {
      throw new MissingParamError('TokenGenerator')
    }

    if (!this.tokenGenerator.sign) {
      throw new InvalidParamError('TokenGenerator')
    }
  }
}

function makeSut () {
  const sut = new GenerateAccessTokenRepository()
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
})
