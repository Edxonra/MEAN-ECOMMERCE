const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const config = require('./config/db.js')

const userRoutes = require('./routes/userRoute.js')
const productRoutes = require('./routes/productRoutes.js')
const orderRoutes = require('./routes/orderRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js')

dotenv.config()
config.connectDB()

const app = express()

app.use(express.json())

app.use('/users',userRoutes)
app.use('/products',productRoutes)
app.use('/orders',orderRoutes)
app.use('/upload',uploadRoutes)


//const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))


if(process.env.NODE_ENV=='production'){
  app.use(express.static(path.join(__dirname,'/frontend/build')))
  app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))
}
else{
  app.get('/', (req, res) => {
    res.status(200).send("ENDPOINTS")
  })
}


const port = process.env.PORT || 3000 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})