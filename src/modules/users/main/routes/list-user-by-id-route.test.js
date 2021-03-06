const request = require('supertest')

const app = require('../../../../lib/app')
const mongoHelper = require('../../../../lib/database')
const userModel = require('../../domain/entity/model/user-model')

describe('ListUserById Route', function () {
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

  let usersList = null

  beforeAll(async function () {
    await mongoHelper.connect(process.env.MONGO_URL)

    usersList = await userModel.insertMany(fakeUsers)
  })

  afterAll(async function () {
    await mongoHelper.disconnect()
  })

  beforeEach(async function () {
    await userModel.deleteMany()
  })

  it('shoud return an user if it is found', async function () {
    const user = usersList[1]

    await request(app)
      .get(`/users/${user._id}`)
      .expect(200)
  })
})
