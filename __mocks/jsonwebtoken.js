class Jsonwebtoken {
  sign (data, secret, options) {
    this.data = data
    this.secret = secret
    this.options = options

    return 'any_token'
  }
}

module.exports = new Jsonwebtoken()
