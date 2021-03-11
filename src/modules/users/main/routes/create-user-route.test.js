const request = require('supertest')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('User routes', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

  it('should create an user when valid data are provided', async function () {
    const fakeUser = {
      name: 'User name',
      email: 'user@email.com',
      password: 'user password',
      repeatPassword: 'user password'
    }

    await request(app)
      .post('/users')
      .send(fakeUser)
      .expect(200)
  })
})
