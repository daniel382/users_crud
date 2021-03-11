const ComparePasswordUseCase = require('./compare-password-usecase')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

function makeSut () {
  const sut = new ComparePasswordUseCase()
  return { sut }
}

describe('ComparePasswordUseCase', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    expect(sut.compare).toThrow(new MissingParamError('password'))
  })

  it('should throw if no repeatPassword is provided', function () {
    const { sut } = makeSut()
    const call = _ => sut.compare('any_password')

    expect(call).toThrow(new MissingParamError('repeatPassword'))
  })

  it('should return false if password and repeatPassword are not equal', function () {
    const { sut } = makeSut()
    const isEqual = sut.compare('any_password', 'any_other_password')

    expect(isEqual).toBe(false)
  })

  it('should return true if password and repeatPassword are equal', function () {
    const { sut } = makeSut()
    const isEqual = sut.compare('any_password', 'any_password')

    expect(isEqual).toBe(true)
  })
})
