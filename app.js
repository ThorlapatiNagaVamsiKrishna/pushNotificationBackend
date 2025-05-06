const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectToDB = require('./dbConnection')
const UserRouter = require('./Routes/userRoutes')
const notificationRouter = require('./Routes/notificationRoutes')
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()
connectToDB()

app.use('/user', UserRouter)
app.use('/send', notificationRouter)


app.listen(5000, () => console.log('server running at port 5000'))