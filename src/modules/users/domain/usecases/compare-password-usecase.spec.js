const MissingParamError = require('../../presentation/errors/missing-param-error')

class ComparePasswordUseCase {
  compare (password, repeatPassword) {
    if (!password) {
      throw new MissingParamError('password')
    }

    if (!repeatPassword) {
      throw new MissingParamError('repeatPassword')
    }

    return false
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
})
