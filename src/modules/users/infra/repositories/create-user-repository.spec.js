const CreateUserRepository = require('./create-user-repository')

const userModel = require('../../domain/entity/model/user-model')
const MissingParamError = require('../../presentation/errors/missing-param-error')
const InvalidParamError = require('../../presentation/errors/invalid-param-error')

const mongoHelper = require('../../../../utils/repository/mongo-helper')

function makeSut () {
  const sut = new CreateUserRepository(userModel)
  return { sut }
}

describe('CreateUserRepository', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

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

    expect(promise).rejects.toThrow(new InvalidParamError('user'))
  })

  it('should create an user', async function () {
    const { sut } = makeSut()
    const user = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }

    const newUser = await sut.save(user)

    expect(newUser).toHaveProperty('_id')
    expect(newUser.name).toBe(user.name)
    expect(newUser.email).toBe(user.email)
    expect(newUser.password).toBe(user.password)
  })
})
