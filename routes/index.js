const express = require("express")
const Book = require('../models/book')
const router = express.Router()


router.get("/",async (req, res)=> {
    let books
    try {
         books = await Book.find({}).sort({createdAt: 'desc'}).limit(5)
        res.render("index", {books})
    } catch (error) {
        console.log(error.message)
        books = []
        res.render('index', {books})
        
    }

})

module.exports = router