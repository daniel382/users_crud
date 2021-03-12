class UpdateUserRouter {
  constructor (loadUserByIdRepository) {
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async route () {
    if (!this.loadUserByIdRepository) {
      return { statusCode: 500 }
    }

    if (!this.loadUserByIdRepository.load) {
      return { statusCode: 500 }
    }
  }
}

describe('UpdateUserRouter', function () {
  it('should return 500 if no LoadUserByIdRepository is provided', async function () {
    const sut = new UpdateUserRouter()
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid LoadUserByIdRepository is provided', async function () {
    const sut = new UpdateUserRouter({})
    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })
})
