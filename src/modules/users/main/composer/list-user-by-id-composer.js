const ListUserByIdRouter = require('../../presentation/routes/list-user-by-id-router')

const LoadUserByIdRepository = require('../../infra/repositories/load-user-by-id-repository')
const userModel = require('../../domain/entity/model/user-model')

class ListUserByIdComposer {
  static compose () {
    const loadUserByIdRepository = new LoadUserByIdRepository(userModel)

    return new ListUserByIdRouter(loadUserByIdRepository)
  }
}

module.exports = ListUserByIdComposer
