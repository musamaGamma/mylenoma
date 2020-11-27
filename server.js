
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const helmet = require("helmet")

const app = express()

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
    const morgan = require("morgan")
    app.use(morgan("dev"))
}

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
app.use(helmet())
app.use(express.urlencoded({limit: "10mb", extended: false}))
//endpoint routes
app.use("/", require("./routes/index"))
app.use("/authors", require("./routes/authors"))

const port = process.env.PORT || 5000
app.listen(port, ()=> console.log(`listening on port ${port}`))

