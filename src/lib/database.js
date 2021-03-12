const mongoose = require('mongoose')

class MongoHelper {
  async connect (url) {
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    this.connection = conn.connection
  }

  async disconnect () {
    await this.connection.close()
  }
}

module.exports = new MongoHelper()
