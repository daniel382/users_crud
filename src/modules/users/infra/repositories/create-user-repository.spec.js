const userModel = require('../../domain/entity/model/user-model')
const MissingParamError = require('../../presentation/errors/missing-param-error')
const InvalidParamError = require('../../presentation/errors/invalid-param-error')

class CreateUserRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async save (user) {
    if (!user) {
      throw new MissingParamError('user')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    const { name, email, password } = user
    if (!name || !email || !password) {
      throw new InvalidParamError('user')
    }
  }
}

function makeSut () {
  const sut = new CreateUserRepository(userModel)
  return { sut }
}

describe('CreateUserRepository', function () {
  it('should throw if no user is provided', function () {
    const { sut } = makeSut()
    const promise = sut.save()

    expect(promise).rejects.toThrow(new MissingParamError('user'))
  })

  it('should throw if no userModel is provided', function () {
    const sut = new CreateUserRepository()
    const user = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }

    const promise = sut.save(user)

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should throw if an invalid user is provided', function () {
    const { sut } = makeSut()
    const invalidUser = {}

    const promise = sut.save(invalidUser)

    expect(promise).rejects.toThrow(new InvalidParamError('user '))
  })
})
