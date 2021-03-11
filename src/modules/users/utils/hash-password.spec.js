const MissingParamError = require('../presentation/errors/missing-param-error')

class HashPassword {
  async hash (password) {
    throw new MissingParamError('password')
  }
}

function makeSut () {
  const sut = new HashPassword()
  return { sut }
}

describe('HashPassword', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    expect(sut.hash).rejects.toThrow(new MissingParamError('password'))
  })
})
