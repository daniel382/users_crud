const UpdateUserRouter = require('../../presentation/routes/update-user-router')

const LoadUserByIdRepository = require('../../infra/repositories/load-user-by-id-repository')
const UpdateUserByIdRepository = require('../../infra/repositories/update-user-by-id-repository')
const userModel = require('../../domain/entity/model/user-model')

class UpdateUsersRouterComposer {
  static compose () {
    const loadUserByIdRepository = new LoadUserByIdRepository(userModel)
    const updateUserByIdRepository = new UpdateUserByIdRepository(userModel)

    return new UpdateUserRouter(loadUserByIdRepository, updateUserByIdRepository)
  }
}

module.exports = UpdateUsersRouterComposer
