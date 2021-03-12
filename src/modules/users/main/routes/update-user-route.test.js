const request = require('supertest')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('UpdateUserRoute', function () {
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
      .put('/users/600dd38257176648a8f91386')
      .expect(404)
  })

  it('should return 200 if user is successfully updated', async function () {
    const fakeUser = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
      token: 'any_token'
    }

    const savedUser = await userModel.create(fakeUser)
    const id = savedUser._id

    await request(app)
      .put(`/users/${id}`)
      .send({
        name: 'updated_name',
        email: 'updated@email.com',
        password: 'updated_password'
      })
      .expect(200)
  })
})
