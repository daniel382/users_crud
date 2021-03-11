const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class GenerateAccessTokenRepository {
  async sign (data) {
    throw new MissingParamError('data')
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
})
