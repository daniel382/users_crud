const request = require('supertest')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('ListUsersRoute', function () {
  const fakeUsers = [{
    name: 'user01',
    email: 'user01@email.com',
    password: 'user01_password',
    token: 'user01_token'
  }, {
    name: 'user02',
    email: 'user02@email.com',
    password: 'user02_password',
    token: 'user02_token'
  }, {
    name: 'user03',
    email: 'user03@email.com',
    password: 'user03_password',
    token: 'user03_token'
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

  it('should return a list of users', async function () {
    await userModel.insertMany(fakeUsers)
    const httpResponse = await request(app)
      .get('/users')

    expect(httpResponse.body.length).toBe(3)
  })

  it('should return an empty list if no user is found', async function () {
    const httpResponse = await request(app)
      .get('/users')

    expect(httpResponse.body.length).toBe(0)
  })
})
