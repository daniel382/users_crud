require('dotenv').config()

const app = require('./app')
const { HOST, PORT } = process.env

app.listen(PORT, () => console.log(`listening on http://${HOST}:${PORT}`))
