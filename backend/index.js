require('dotenv').config()
const express = require('express')
const cors = require('cors')
const api = require('./routes/api')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', api)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Backend listening on ${port}`))
