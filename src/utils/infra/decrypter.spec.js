const bcrypt = require('../../../__mocks__/bcryptjs')
const MissingParamError = require('../presentation/errors/missing-param-error')

class Decrypter {
  async compare (password, hash) {
    if (!password) {
      throw new MissingParamError('password')
    }

    if (!hash) {
      throw new MissingParamError('hash')
    }
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

  it('should throw if no hash is provided', function () {
    const { sut } = makeSut()
    const promise = sut.compare('any_password')

    expect(promise).rejects.toThrow(new MissingParamError('hash'))
  })
})
