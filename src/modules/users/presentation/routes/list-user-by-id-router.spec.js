class ListUserByIdRouter {
  async route (httpRequest) {
    return { statusCode: 400 }
  }
}

function makeSut () {
  const sut = new ListUserByIdRouter()
  return { sut }
}

describe('ListUsersRouter', function () {
  it('shoud return 400 if no id param is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
