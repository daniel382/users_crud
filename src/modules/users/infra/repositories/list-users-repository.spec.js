const userModel = require('../../domain/entity/model/user-model')
const mongoHelper = require('../../../../lib/database')

const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')
const InvalidParamError = require('../../../../utils/presentation/errors/invalid-param-error')

class ListUsersRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async list (page, limit) {
    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }

    if (!page && page !== 0) {
      throw new MissingParamError('page')
    }

    if (!limit && limit !== 0) {
      throw new MissingParamError('limit')
    }

    if (page < 0) {
      throw new InvalidParamError('page')
    }

    if (limit <= 0) {
      throw new InvalidParamError('limit')
    }

    return await this.userModel
      .find()
      .skip(page * limit)
      .limit(limit)
  }
}

function makeSut () {
  const sut = new ListUsersRepository(userModel)
  return { sut }
}

describe('ListUsersRepository', function () {
  const fakeUsers = [{
    name: 'user01',
    email: 'user01@email.com',
    password: 'user01_password'
  }, {
    name: 'user02',
    email: 'user02@email.com',
    password: 'user02_password'
  }, {
    name: 'user03',
    email: 'user03@email.com',
    password: 'user03_password'
  }]

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
    const sut = new ListUsersRepository()
    const promise = sut.list()

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })

  it('should throw if no page is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list()

    expect(promise).rejects.toThrow(new MissingParamError('page'))
  })

  it('should throw if no limit is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list(0)

    expect(promise).rejects.toThrow(new MissingParamError('limit'))
  })

  it('should throw if an invalid page is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list(-1, 10)

    expect(promise).rejects.toThrow(new InvalidParamError('page'))
  })

  it('should throw if an invalid limit is provided', function () {
    const { sut } = makeSut()
    const promise = sut.list(0, 0)

    expect(promise).rejects.toThrow(new InvalidParamError('limit'))
  })

  it('should return an empty list if no user is found', async function () {
    const { sut } = makeSut()
    const users = await sut.list(0, 10)

    expect(users).toEqual([])
  })

  it('should return a list of users', async function () {
    const { sut } = makeSut()
    const savedUsers = await userModel.insertMany(fakeUsers)
    const loadedUsers = await sut.list(0, 10)

    expect(loadedUsers.length).toBe(savedUsers.length)
  })
})
