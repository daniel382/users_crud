const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../../domain/entity/model/user-model')
const CreateUserRouter = require('../../presentation/routes/create-user-router')

const ComparePasswordUseCase = require('../../domain/usecases/compare-password-usecase')
const HashPassword = require('../../../../utils/infra/encrypter')
const CreateUserRepository = require('../../infra/repositories/create-user-repository')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const GenerateAccessTokenRepository = require('../../infra/repositories/generate-access-token-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')

class CreateUserRouterComposer {
  static compose () {
    const comparePasswordUseCase = new ComparePasswordUseCase()
    const hashPassword = new HashPassword(bcryptjs)
    const createUserRepository = new CreateUserRepository(userModel)
    const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)
    const generateAccessTokenRepository = new GenerateAccessTokenRepository(jwt)
    const updateAccessTokenRepository = new UpdateAccessTokenRepository(userModel)

    return new CreateUserRouter(
      comparePasswordUseCase,
      hashPassword,
      createUserRepository,
      loadUserByEmailRepository,
      generateAccessTokenRepository,
      updateAccessTokenRepository
    )
  }
}

module.exports = CreateUserRouterComposer
