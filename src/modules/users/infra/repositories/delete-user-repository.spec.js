const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class DeleteUserRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async delete (id) {
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }
  }
}

function makeSut () {
  const sut = new DeleteUserRepository()
  return { sut }
}

describe('DeleteUserRepository', function () {
  it('should throw if no id is provided', function () {
    const { sut } = makeSut()
    const promise = sut.delete()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  it('should throw if no userModel is provided', function () {
    const sut = new DeleteUserRepository()
    const promise = sut.delete('any_user_id')

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
