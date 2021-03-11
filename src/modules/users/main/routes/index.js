const { Router } = require('express')
const router = Router()

const ExpressAdapter = require('../../../../utils/adapters/express-adapter')

const CreateUserRouterComposer = require('../composer/create-user-router-composer')
const ListUserByIdComposer = require('../composer/list-user-by-id-composer')

router.post('/users', ExpressAdapter.adapt(CreateUserRouterComposer.compose()))
router.get('/users/:id', ExpressAdapter.adapt(ListUserByIdComposer.compose()))

module.exports = router
