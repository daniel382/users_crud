require('dotenv').config()
const mongoHelper = require('./database')

mongoHelper.connect(process.env.MONGO_URL)
  .then(_ => require('./server'))
  .catch(console.error)
