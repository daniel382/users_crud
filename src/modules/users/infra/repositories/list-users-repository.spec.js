const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class ListUsersRepository {
  async list (page, limit) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }
  }
}

describe('ListUsersRepository', function () {
  it('should throw if no userModel is provided', function () {
    const sut = new ListUsersRepository()
    const promise = sut.list()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
