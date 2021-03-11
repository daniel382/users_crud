const mongoose = require('mongoose')

class MongoHelper {
  async connect (url) {
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })

    this.connection = conn.connection
  }

  async disconnect () {
    await this.connection.close()
  }
}

module.exports = new MongoHelper()
