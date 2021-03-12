const DeleteUserRouter = require('../../presentation/routes/delete-user-router')

const LoadUserByIdRepository = require('../../infra/repositories/load-user-by-id-repository')
const DeleteUserRepository = require('../../infra/repositories/delete-user-repository')
const userModel = require('../../domain/entity/model/user-model')

class DeleteUserRouterComposer {
  static compose () {
    const loadUserByIdRepository = new LoadUserByIdRepository(userModel)
    const deleteUserRepository = new DeleteUserRepository(userModel)

    return new DeleteUserRouter(deleteUserRepository, loadUserByIdRepository)
  }
}

module.exports = DeleteUserRouterComposer
