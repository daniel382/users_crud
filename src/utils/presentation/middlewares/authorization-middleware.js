const jwt = require('jsonwebtoken')
// const userModel = require('../../../modules/users/domain/entity/model/user-model')
const config = require('../../../config/secret.json')

async function authorizationMiddleware (req, res, next) {
  if (/^\/sign(in|up)$/.test(req.path) || process.env.NODE_ENV === 'test') {
    return next()
  }

  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).json({ error: 'token is required' })
  }

  const parts = auth.split(' ')
  if (!(parts.length === 2)) {
    return res.status(401).json({ error: 'unrecognized token' })
  }

  const [scheme, token] = parts
  if (!(/^Baerer$/i.test(scheme))) {
    return res.status(401).json({ error: 'malformatted token' })
  }

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: 'invalid token' })
    }

    next()
  })
}

module.exports = authorizationMiddleware
