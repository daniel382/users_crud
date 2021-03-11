class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error.message
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new Error('Internal server error').message
    }
  }
}

module.exports = HttpResponse
