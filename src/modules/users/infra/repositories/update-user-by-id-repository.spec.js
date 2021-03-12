const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')
const UpdateUserByIdRepository = require('./update-user-by-id-repository')

function makeSut () {
  const sut = new UpdateUserByIdRepository(userModel)
  return { sut }
}

describe('UpdateUserByIdRepository', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

  it('should throw if no userModel is provided', function () {
    const sut = new UpdateUserByIdRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should throw if no id is provided', function () {
    const { sut } = makeSut()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  it('should throw if no user is provided', function () {
    const { sut } = makeSut()
    const promise = sut.update('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('user'))
  })

  it('should return an updated user', async function () {
    const { sut } = makeSut()

    const user = await userModel.create({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    })

    const userToUpdate = {
      name: 'updated_user_name',
      email: 'updated_user_email',
      password: 'updated_user_password'
    }

    const updatedUser = await sut.update(user._id, userToUpdate)

    expect(updatedUser.name).toBe(userToUpdate.name)
    expect(updatedUser.email).toBe(userToUpdate.email)
    expect(updatedUser).toHaveProperty('__v')
  })
})
