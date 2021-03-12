const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class UpdateAccessTokenRepository {
  async update (accessToken) {
    if (!accessToken) {
      throw new MissingParamError('AccessToken')
    }
  }
}

describe('UpdateAccessTokenRepository', function () {
  it('shound throw if no accessToken is provided', function () {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('AccessToken'))
  })
})
