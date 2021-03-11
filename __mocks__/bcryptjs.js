class Bcryptjs {
  async hash (data, rounds) {
    this.data = data
    this.rounds = rounds

    return 'any_hashed_value'
  }
}

module.exports = new Bcryptjs()
