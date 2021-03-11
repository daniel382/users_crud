class Jsonwebtoken {
  sign (data, secret, options) {
    this.data = data
    this.secret = secret
    this.options = options
  }
}

module.exports = new Jsonwebtoken()
