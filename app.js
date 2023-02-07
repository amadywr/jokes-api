require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const rateLimiter = require('express-rate-limit')

const limiter = rateLimiter({
  windowMs: 1000 * 60, // 1 minute
  max: 5,
})

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(limiter)

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use('/api/jokes', require('./routes/api/jokes'))
app.use('/api/users', require('./routes/api/users'))

app.listen(3000, () => console.log(`server started on port 3000`))
