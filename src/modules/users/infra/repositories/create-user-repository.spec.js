const MissingParamError = require('../../presentation/errors/missing-param-error')

class CreateUserRepository {
  async save (user) {
    if (!user) {
      throw new MissingParamError('user')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }
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

  it('should throw if no userModel is provided', function () {
    const { sut } = makeSut()
    const user = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }

    const promise = sut.save(user)

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
