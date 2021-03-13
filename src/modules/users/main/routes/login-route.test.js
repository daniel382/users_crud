const request = require('supertest')

const bcrypt = require('bcryptjs')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('LoginRoute', function () {
  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

  it('should return 404 if no user is found', async function () {
    await request(app)
      .post('/signin')
      .send({
        email: 'no_registered@email.com',
        password: 'any_password'
      })
      .expect(404)
  })

  it('should return 200 if user is successfully logged in', async function () {
    const password = await bcrypt.hash('any_password', 10)

    const user = await userModel.create({
      name: 'user name',
      email: 'user@email.com',
      password,
      token: 'any_previous_token'
    })

    const response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        password: 'any_password'
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })
})
