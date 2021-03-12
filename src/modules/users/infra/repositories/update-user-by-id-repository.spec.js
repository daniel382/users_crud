const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const userModel = require('../../domain/entity/model/user-model')

class UpdateUserByIdRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (id, user) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    if (!id) {
      throw new MissingParamError('id')
    }

    if (!user) {
      throw new MissingParamError('user')
    }
  }
}

function makeSut () {
  const sut = new UpdateUserByIdRepository(userModel)
  return { sut }
}

describe('UpdateUserByIdRepository', function () {
  it('should throw if no userModel is provided', function () {
    const sut = new UpdateUserByIdRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should throw if no id is provided', function () {
    const { sut } = makeSut()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  it('should throw if no user is provided', function () {
    const { sut } = makeSut()
    const promise = sut.update('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('user'))
  })
})
