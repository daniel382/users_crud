const MissingParamError = require('../../presentation/errors/missing-param-error')

class CreateUserRepository {
  async save (user) {
    throw new MissingParamError('user')
  }
}

function makeSut () {
  const sut = new CreateUserRepository()
  return { sut }
}

describe('CreateUserRepository', function () {
  it('should throw if no user is provided', function () {
    const { sut } = makeSut()
    const promise = sut.save()

    expect(promise).rejects.toThrow(new MissingParamError('user'))
  })
})
