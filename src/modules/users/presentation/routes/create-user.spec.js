class CreateUser {
  async store (httpRequest) {
    return { statusCode: 400 }
  }
}

function makeSut () {
  const sut = new CreateUser()
  return { sut }
}

describe('Create User', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.store(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
