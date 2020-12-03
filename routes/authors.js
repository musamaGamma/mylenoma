const express = require("express")
const Author = require("../models/author")
const Book = require("../models/book")
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
res.redirect(`authors/${author.id}`)
} catch (error) {
    console.log(error.message)
    res.status(500).render("authors/new", {errorMessage: error.message, author})
}
})

//show  author
router.get("/:id", async(req, res)=> {
    try {
      const author = await Author.findById(req.params.id)
      const booksByAuthor = await Book.find({author: author.id})
      if(!author) throw new Error('author not found')
      res.render("authors/show", {author, booksByAuthor})
    } catch (error) {
      console.log(error.message)
      res.redirect("/")
    }
})

//get author edit page
router.get("/:id/edit", async (req, res)=> {
    try {
        const author = await Author.findById(req.params.id)
        if(!author) throw new Error('author not found')
        res.render("authors/edit", {author})
      } catch (error) {
        console.log(error.message)
        res.redirect("/authors")
      }
})

//update author 
router.put("/:id", async(req, res)=> {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        if(!author) {
            res.redirect("/")
        }
        console.log(error.message)
        res.render("/authors/edit", {errorMessage: error.message, author})
    }
})

// delete author
router.delete("/:id", async(req, res)=> {
    let author
    try {
       author =  await Author.findById(req.params.id)
       await author.remove()
       res.redirect("/authors")
    } catch (error) {
        console.log(error.message)
        res.redirect(`/authors/${author.id}`)
    }
})

module.exports = router