class Bcryptjs {
  async hash (data, rounds) {
    this.data = data
    this.rounds = rounds

    return 'any_hashed_value'
  }

  async compare (data, hash) {
    this.data = data
    this.hashValue = hash
  }
}

module.exports = new Bcryptjs()
