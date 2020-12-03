const mongoose = require("mongoose")
const Book = require("./book")
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})


authorSchema.pre("remove", function(next) {
    Book.find({author: this.id}, (err, books)=> {
        if(err) {
            next(err)
        }
        else if (books.length > 0) {
            next(new Error("there are still books written by this author"))
        }
        else {
            next()
        }
    })
})

module.exports = mongoose.model("Author", authorSchema)