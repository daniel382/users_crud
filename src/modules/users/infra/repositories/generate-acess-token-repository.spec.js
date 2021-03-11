const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class GenerateAccessTokenRepository {
  async sign (data) {
    if (!data) {
      throw new MissingParamError('data')
    }

    if (!this.tokenGenerator) {
      throw new MissingParamError('TokenGenerator')
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
})
