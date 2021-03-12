const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class DeleteUserRepository {
  async delete (id) {
    throw new MissingParamError('id')
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
})
