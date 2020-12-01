const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const imageTypes = ["image/jpeg", "image/png", "image/gif"];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     console.log("hello multer", file.mimetype);
//     callback(null, imageTypes.includes(file.mimetype));
//   },
// });
const router = express.Router();

//GET all books
// GET /books

router.get("/", async (req, res) => {
    let searchOptions = {}
  if(req.query.title) {
     searchOptions = {
          title: {
              $regex: req.query.title,
              $options: 'ig'
          }
      }
  }
  if(req.query.publishedBefore) {
      searchOptions = {...searchOptions,
        publishDate: {
            $lte: req.query.publishedBefore,
          }
      }
  }
  if(req.query.publishedAfter) {
      searchOptions = {
          ...searchOptions,
        publishDate: {
            $gte: req.query.publishedAfter,
          }
      }
  }



  try {
    const books = await Book.find(searchOptions);
    searchOptions = {
      title: req.query.title,
      publishedAfter: req.query.publishedAfter,
      publishedBefore: req.query.publishedBefore,
    };
    res.render("books/index", { books, searchOptions });
  } catch (error) {
    console.log(error.message);
    res.redirect("/")
  }
});

// get add book page
router.get("/new", async (req, res) => {
  try {
    const book = new Book();
    const authors = await Author.find({});
    res.render("books/new", { book, authors });
  } catch (error) {
    console.log(error.message);
    res.redirect("/books");
  }
});

//add a new book
//POST /books

router.post("/", async (req, res) => {
 
  try {
    const book = new Book({
      title: req.body.title,
      pageCount: req.body.pageCount,
      description: req.body.description,
      publishDate: new Date(req.body.publishDate),
      author: req.body.author,
    });
      saveCover(book, req.body.cover)
   const newBook = await book.save();
    res.redirect("/books");
  } catch (error) {
    
    console.log(error.message);
    res.redirect("/books/new");
  }
});

function saveCover(book, coverEncoded) {
  if(!coverEncoded) return


  const cover = JSON.parse(coverEncoded)
  if(cover && imageTypes.includes(cover.type)) {
    console.log(cover)
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}
module.exports = router;
