const request = require('supertest')

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
})
