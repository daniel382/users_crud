class NotFound extends Error {
  constructor (paramName) {
    super(`${paramName} not found`)
    this.name = 'NotFound'
  }
}

module.exports = NotFound
