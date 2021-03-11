const bcrypt = require('../../../../__mocks__/bcryptjs')
const MissingParamError = require('../presentation/errors/missing-param-error')

class HashPassword {
  constructor (crypt) {
    this.crypt = crypt
  }

  async hash (password) {
    if (!password) {
      throw new MissingParamError('password')
    }

    await this.crypt.hash(password, 10)
  }
}

function makeSut () {
  const sut = new HashPassword(bcrypt)
  return { sut }
}

describe('HashPassword', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    expect(sut.hash).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call crypt with correct values', async function () {
    const { sut } = makeSut()
    await sut.hash('any_password')

    expect(bcrypt.data).toBe('any_password')
    expect(bcrypt.rounds).toBe(10)
  })
})
