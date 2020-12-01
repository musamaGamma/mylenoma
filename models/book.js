const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
        
    },
    description: {
        type: String
    }
    
}, {timestamps: true})

bookSchema.virtual("coverImagePath").get(function() {
    if(this.coverImage && this.coverImageType) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString("base64")}`
    }
})

module.exports = mongoose.model("Book", bookSchema)

