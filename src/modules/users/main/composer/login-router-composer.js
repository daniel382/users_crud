const LoginRouter = require('../../presentation/routes/login-router')

const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const GenerateAccessTokenRepository = require('../../infra/repositories/generate-access-token-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')

const userModel = require('../../domain/entity/model/user-model')
const Decrypter = require('../../../../utils/infra/decrypter')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class LoginRouterComposer {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)
    const decrypter = new Decrypter(bcrypt)
    const generateAccessTokenRepository = GenerateAccessTokenRepository(jwt)
    const updateAccessTokenRepository = UpdateAccessTokenRepository(userModel)

    return new LoginRouter(
      loadUserByEmailRepository,
      decrypter,
      generateAccessTokenRepository,
      updateAccessTokenRepository
    )
  }
}

module.exports = LoginRouterComposer
