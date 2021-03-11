class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

function makeSut () {
  const sut = new LoadUserByEmailRepository()
  return { sut }
}

describe('LoadUserByEmailRepository', function () {
  it('should return null if no user is found', async function () {
    const { sut } = makeSut()
    const result = await sut.load('no_registered@email.com')

    expect(result).toBe(null)
  })
})
