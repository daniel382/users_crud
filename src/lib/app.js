const express = require('express')

class App {
  constructor () {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(express.json())

    this.app.disable('x-powered-by')

    this.app.use((req, res, next) => {
      res.set('access-control-allow-origin', '*')
      res.set('access-control-allow-methods', '*')
      res.set('access-control-allow-headers', '*')

      next()
    })
  }

  routes () {

  }
}

module.exports = new App().app
