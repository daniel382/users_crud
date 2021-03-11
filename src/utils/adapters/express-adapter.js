class ExpressAdapter {
  static adapt (router) {
    return async function (req, res) {
      const httpRequest = {
        body: req.body
      }

      const httpResponse = router.route(httpRequest)
      res.status(httpRequest.statusCode).json(httpResponse.body)
    }
  }
}

module.exports = ExpressAdapter
