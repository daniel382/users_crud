const MissingParamError = require('../../presentation/errors/missing-param-error')

class ComparePasswordUseCase {
  compare (password, repeatPassword) {
    throw new MissingParamError('password')
  }
}

function makeSut () {
  const sut = new ComparePasswordUseCase()
  return { sut }
}

describe('ComparePasswordUseCase', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    expect(sut.compare).toThrow(new MissingParamError('password'))
  })
})
