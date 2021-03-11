const { Router } = require('express')
const router = Router()

const ExpressAdapter = require('../../../../utils/adapters/express-adapter')

const CreateUserRouterComposer = require('../composer/create-user-router-composer')

router.post('/users', ExpressAdapter.adapt(CreateUserRouterComposer.compose()))

module.exports = router
