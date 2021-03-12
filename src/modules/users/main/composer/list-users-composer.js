const ListUsersRouter = require('../../presentation/routes/list-users-router')
const ListUsersRepository = require('../../infra/repositories/list-users-repository')
const userModel = require('../../domain/entity/model/user-model')

class ListUsersRouterComposer {
  static compose () {
    const listUsersRepository = new ListUsersRepository(userModel)

    return new ListUsersRouter(listUsersRepository)
  }
}

module.exports = ListUsersRouterComposer
