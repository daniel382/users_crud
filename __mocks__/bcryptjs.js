class Bcryptjs {
  constructor () {
    this.isOk = true
  }

  async hash (data, rounds) {
    this.data = data
    this.rounds = rounds

    return 'any_hashed_value'
  }

  async compare (data, hash) {
    this.data = data
    this.hashValue = hash
    return this.isOk
  }
}

module.exports = new Bcryptjs()
