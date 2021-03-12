const bcrypt = require('../../../__mocks__/bcryptjs')
const MissingParamError = require('../presentation/errors/missing-param-error')

class Decrypter {
  async compare (password, hash) {
    throw new MissingParamError('password')
  }
}

function makeSut () {
  const sut = new Decrypter(bcrypt)
  return { sut }
}

describe('Decrypter', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    const promise = sut.compare()

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
