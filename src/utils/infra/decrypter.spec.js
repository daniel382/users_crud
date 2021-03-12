const bcrypt = require('../../../__mocks__/bcryptjs')
const MissingParamError = require('../presentation/errors/missing-param-error')

class Decrypter {
  constructor (crypter) {
    this.crypter = crypter
  }

  async compare (password, hash) {
    if (!password) {
      throw new MissingParamError('password')
    }

    if (!hash) {
      throw new MissingParamError('hash')
    }

    if (!this.crypter) {
      throw new MissingParamError('crypter')
    }

    return await this.crypter.compare(password, hash)
  }
}

function makeSut () {
  bcrypt.isOk = true
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

  it('should throw if no crypter is provided', function () {
    const sut = new Decrypter()
    const promise = sut.compare('any_password', 'any_hash')

    expect(promise).rejects.toThrow(new MissingParamError('crypter'))
  })

  it('should call crypter with correct values', async function () {
    const { sut } = makeSut()
    await sut.compare('any_password', 'any_hash')

    expect(sut.crypter.data).toBe('any_password')
    expect(sut.crypter.hashValue).toBe('any_hash')
  })

  it('should return false if values are not equivalents', async function () {
    const { sut } = makeSut()
    sut.crypter.isOk = false
    const isOk = await sut.compare('any_wrong_password', 'any_wrong_hash')

    expect(isOk).toBe(false)
  })

  it('should return true if values are equivalents', async function () {
    const { sut } = makeSut()
    const isOk = await sut.compare('any_wrong_password', 'any_wrong_hash')

    expect(isOk).toBe(true)
  })
})
