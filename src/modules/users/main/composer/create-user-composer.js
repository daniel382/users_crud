const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../../domain/entity/model/user-model')
const CreateUser = require('../../presentation/routes/create-user')

const ComparePasswordUseCase = require('../../domain/usecases/compare-password-usecase')
const HashPassword = require('../../../../utils/infra/encrypter')
const CreateUserRepository = require('../../infra/repositories/create-user-repository')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const GenerateAccessTokenRepository = require('../../infra/repositories/generate-access-token-repository')

class CreateUserRouterComposer {
  static compose () {
    const comparePasswordUseCase = new ComparePasswordUseCase()
    const hashPassword = new HashPassword(bcryptjs)
    const createUserRepository = new CreateUserRepository(userModel)
    const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)
    const generateAccessTokenRepository = new GenerateAccessTokenRepository(jwt)

    return new CreateUser(
      comparePasswordUseCase,
      hashPassword,
      createUserRepository,
      loadUserByEmailRepository,
      generateAccessTokenRepository
    )
  }
}

module.exports = CreateUserRouterComposer
