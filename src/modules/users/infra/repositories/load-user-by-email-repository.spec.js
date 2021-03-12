const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')

function makeSut () {
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut }
}

describe('LoadUserByEmailRepository', function () {
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
    const result = await sut.load('no_registered@email.com')

    expect(result).toBe(null)
  })

  it('should return an user if it exists', async function () {
    const { sut } = makeSut()
    await userModel.create({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
      token: 'any_token'
    })

    const result = await sut.load('any@email.com')

    expect(result.email).toBe('any@email.com')
  })

  it('should throw if no email is provided', function () {
    const { sut } = makeSut()

    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw if no userModel is provided', function () {
    const sut = new LoadUserByEmailRepository()

    const promise = sut.load('any_email')
    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
