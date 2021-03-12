const { Router } = require('express')
const router = Router()

const ExpressAdapter = require('../../../../utils/adapters/express-adapter')

const CreateUserRouterComposer = require('../composer/create-user-router-composer')
const ListUserByIdComposer = require('../composer/list-user-by-id-composer')
const ListUsersRouterComposer = require('../composer/list-users-composer')
const DeleteUserRoute = require('../composer/delete-user-router-composer')

router.get('/users/:id', ExpressAdapter.adapt(ListUserByIdComposer.compose()))
router.get('/users', ExpressAdapter.adapt(ListUsersRouterComposer.compose()))
router.post('/users', ExpressAdapter.adapt(CreateUserRouterComposer.compose()))
router.delete('/users/:id', ExpressAdapter.adapt(DeleteUserRoute.compose()))

module.exports = router
