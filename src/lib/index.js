require('dotenv').config()
const mongoHelper = require('./database')

mongoHelper.connect(process.env.MONGO_URL)

require('./server')
