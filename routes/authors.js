const express = require("express")
const Author = require("../models/author")
const router = express.Router()


//GET all authors
// GET /authors

router.get("/", async(req, res)=> {
    let searchOptions = req.query.name ? {
        name: {
            $regex: req.query.name,
            $options: "ig"
        }
        
    } : {}
    try {
        const authors =await Author.find(searchOptions)

 res.render("authors/index", {authors, searchOptions: req.query.name})
    } catch (error) {
        console.log(error.message)
        res.redirect("authors")
    }
    
})

router.get("/new", (req, res)=> {

    res.render("authors/new", {author: new Author()})
})

//add a new author
//POST /authors

router.post("/",async (req, res)=> {
    let author =new Author({
        name: req.body.name
    })
try {
    
  author =  await author.save()
res.redirect("authors")
} catch (error) {
    console.log(error.message)
    res.status(500).render("authors/new", {errorMessage: error.message, author})
}
})

module.exports = router