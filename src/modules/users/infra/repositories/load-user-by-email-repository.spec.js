const mongoose = require('mongoose')

const userModel = require('../../domain/entity/model/user-model')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const result = await this.userModel.find({ email })
    const user = result[0]

    return user || null
  }
}

function makeSut () {
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut }
}

describe('LoadUserByEmailRepository', function () {
  let connection

  beforeAll(async function () {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })

    connection = conn.connection
  })

  afterAll(async function () {
    await connection.close()
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
      password: 'any_password'
    })

    const result = await sut.load('any@email.com')

    expect(result.email).toBe('any@email.com')
  })
})
