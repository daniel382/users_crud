const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

describe('UpdateAccessTokenRepository', function () {
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
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  it('should throw if no accessToken is provided', function () {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('AccessToken'))
  })

  it('should throw if no userModel is provided', function () {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update('any_id', 'any_accessToken')

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should update user token', async function () {
    const sut = new UpdateAccessTokenRepository(userModel)

    const user = await userModel.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      token: 'any_token'
    })

    await sut.update(user._id, 'new_access_token')
    const updatedUser = await userModel.findById(user._id)

    expect(updatedUser._doc).toEqual({
      _id: user._id,
      name: 'any_name',
      email: 'any_email',
      token: 'new_access_token',
      __v: 0
    })
  })
})
