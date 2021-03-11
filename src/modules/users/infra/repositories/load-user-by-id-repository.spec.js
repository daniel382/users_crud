const LoadUserByIdRepository = require('./load-user-by-id-repository')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')

function makeSut () {
  const sut = new LoadUserByIdRepository(userModel)
  return { sut }
}

describe('LoadUserByIdRepository', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

  it('should return null if no user is found', async function () {
    const { sut } = makeSut()
    const result = await sut.load('600dd38257176648a8f91386')

    expect(result).toBe(null)
  })

  it('should return an user if it exists', async function () {
    const { sut } = makeSut()
    const user = await userModel.create({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    })

    const result = await sut.load(user._id)

    expect(result.email).toBe(user.email)
  })

  it('should throw if no id is provided', function () {
    const { sut } = makeSut()

    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  it('should throw if no userModel is provided', function () {
    const sut = new LoadUserByIdRepository()

    const promise = sut.load('any_email')
    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
