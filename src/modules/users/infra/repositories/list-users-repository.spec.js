const userModel = require('../../domain/entity/model/user-model')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')

class ListUsersRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async list (page, limit) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    if (!page && page !== 0) {
      throw new MissingParamError('page')
    }

    if (!limit) {
      throw new MissingParamError('limit')
    }

    if (page < 0) {
      throw new InvalidParamError('page')
    }
  }
}

function makeSut () {
  const sut = new ListUsersRepository(userModel)
  return { sut }
}

describe('ListUsersRepository', function () {
  it('should throw if no userModel is provided', function () {
    const sut = new ListUsersRepository()
    const promise = sut.list()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should throw if no page is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list()

    expect(promise).rejects.toThrow(new MissingParamError('page'))
  })

  it('should throw if no limit is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list(0)

    expect(promise).rejects.toThrow(new MissingParamError('limit'))
  })

  it('should throw if an invalid page is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list(-1, 10)

    expect(promise).rejects.toThrow(new InvalidParamError('page'))
  })
})
