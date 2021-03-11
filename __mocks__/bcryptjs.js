class Bcryptjs {
  async hash (data, rounds) {
    this.data = data
    this.rounds = rounds
  }
}

module.exports = new Bcryptjs()
