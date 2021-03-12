const MissingParamError = require('../../../../utils/presentation/errors/missing-param-error')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (accessToken) {
    if (!accessToken) {
      throw new MissingParamError('AccessToken')
    }

    if (!this.userModel) {
      throw new MissingParamError('UserModel')
    }
  }
}

describe('UpdateAccessTokenRepository', function () {
  it('shound throw if no accessToken is provided', function () {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update()

    expect(promise).rejects.toThrow(new MissingParamError('AccessToken'))
  })

  it('shound throw if no userModel is provided', function () {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update('any_accessToken')

    expect(promise).rejects.toThrow(new MissingParamError('UserModel'))
  })
})
