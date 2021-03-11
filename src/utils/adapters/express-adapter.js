class ExpressAdapter {
  static adapt (router) {
    return async function (req, res) {
      const httpRequest = {
        body: req.body
      }

      const { statusCode, body } = await router.route(httpRequest)
      res.status(statusCode).json(body)
    }
  }
}

module.exports = ExpressAdapter
