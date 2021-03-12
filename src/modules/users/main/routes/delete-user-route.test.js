const request = require('supertest')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('DeleteUserRoute', function () {
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

  it('should return 404 if no user is found', async function () {
    await request(app)
      .delete('/users/600dd38257176648a8f91386')
      .expect(404)
  })

  it('should return 204 if user is successfully deleted', async function () {
    const users = await userModel.insertMany(fakeUsers)
    const id = users[1]._id

    await request(app)
      .delete(`/users/${id}`)
      .expect(204)
  })
})
