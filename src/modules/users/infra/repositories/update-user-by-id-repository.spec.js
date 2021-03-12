const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class UpdateUserByIdRepository {
  async update (id, user) {
    throw new MissingParamError('UserModel')
  }
}

describe('UpdateUserByIdRepository', function () {
  it('should throw if no userModel is provided', function () {
    const sut = new UpdateUserByIdRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
