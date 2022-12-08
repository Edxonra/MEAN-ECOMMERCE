const express = require('express')
const dotenv = require('dotenv')
const config = require('./config/db.js');

const userRoutes = require("./routes/userRoute.js")
const productRoutes = require('./routes/productRoutes.js')

dotenv.config()

config.connectDB()

const app = express()

app.use(express.json())

app.use('/users',userRoutes)
app.use('/products',productRoutes)

app.get('/', (req, res) => {
  res.status(200).send("ENDPOINTS")
})

const port = process.env.PORT || 3000 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})