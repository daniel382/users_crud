const bcrypt = require('../../../../__mocks__/bcryptjs')
const MissingParamError = require('../presentation/errors/missing-param-error')

class Encrypter {
  constructor (crypter) {
    this.crypter = crypter
  }

  async hash (password) {
    if (!password) {
      throw new MissingParamError('password')
    }

    return await this.crypter.hash(password, 10)
  }
}

function makeSut () {
  const sut = new Encrypter(bcrypt)
  return { sut }
}

describe('Encrypter', function () {
  it('should throw if no password is provided', function () {
    const { sut } = makeSut()
    expect(sut.hash).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call crypter with correct values', async function () {
    const { sut } = makeSut()
    await sut.hash('any_password')

    expect(bcrypt.data).toBe('any_password')
    expect(bcrypt.rounds).toBe(10)
  })

  it('should return a hashed value', async function () {
    const { sut } = makeSut()
    const hashed = await sut.hash('any_password')

    expect(typeof hashed).toBe('string')
    expect(hashed).toBe('any_hashed_value')
  })
})
