const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
})

module.exports = mongoose.model("Author", authorSchema)