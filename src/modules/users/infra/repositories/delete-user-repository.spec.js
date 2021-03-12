const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')
const DeleteUserRepository = require('./delete-user-repository')

function makeSut () {
  const sut = new DeleteUserRepository(userModel)
  return { sut }
}

describe('DeleteUserRepository', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

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

  it('should return true when user is successfully deleted', async function () {
    const { sut } = makeSut()
    const user = await userModel.create({
      name: 'name',
      email: 'email',
      password: 'password',
      token: 'any_token'
    })

    const result = await sut.delete(user._id)
    expect(result).toBe(true)
  })
})
