import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'


dotenv.config()

//import routes
import indexRoute from './routes/index.js'


const app = express()

const __dirname = path.resolve()

//app settings
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))




//db settings
 mongoose.connect(process.env.MONGO_URI, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
 .then(()=> console.log("connected to database"))
 .catch(err => console.log(err.message))

//setting middlewares
app.use(morgan("dev"))
app.use(helmet())
//endpoint routes
app.use("/", indexRoute)

const port = process.env.PORT || 5000
app.listen(port, ()=> console.log(`listening on port ${port}`))

