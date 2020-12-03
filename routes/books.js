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
  let searchOptions = {};
  if (req.query.title) {
    searchOptions = {
      title: {
        $regex: req.query.title,
        $options: "ig",
      },
    };
  }
  if (req.query.publishedBefore) {
    searchOptions = {
      ...searchOptions,
      publishDate: {
        $lte: req.query.publishedBefore,
      },
    };
  }
  if (req.query.publishedAfter) {
    searchOptions = {
      ...searchOptions,
      publishDate: {
        $gte: req.query.publishedAfter,
      },
    };
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
    res.redirect("/");
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
    saveCover(book, req.body.cover);
    const newBook = await book.save();
    res.redirect(`/books/${newBook.id}`);
  } catch (error) {
    console.log(error.message);
    res.redirect("/books/new");
  }
});

//show book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
  
    res.render("books/show", { book });
  } catch (error) {}
});

//get the edit book page

router.get("/:id/edit", async (req, res) => {
  try {
    const authors = await Author.find({});
    const book = await Book.findById(req.params.id);
    res.render("books/edit", { book, authors });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
});

//update book
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.publishDate = new Date(req.body.publishDate);
    book.author = req.body.author
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover) {
      saveCover(book, req.body.cover)
    }
   book = await book.save()
    res.redirect(`/books/${book.id}`)
  } catch (error) {
    console.log(error.message)
    
    res.redirect(`/books/${book.id}/edit`)
  }
});

//delete book
router.delete("/:id", async(req, res)=> {
  let book
  try {
    book =await Book.findByIdAndDelete(req.params.id)
    res.redirect("/books")
  } catch (error) {
    console.log(error.message)
    if(book) {
      res.render(`books/${book.id}`, {errorMessage: error.message, book})
    }
    else {
      res.redirect("/")
    }
    
  }
  

})

function saveCover(book, coverEncoded) {
  if (!coverEncoded) return;

  const cover = JSON.parse(coverEncoded);
  if (cover && imageTypes.includes(cover.type)) {
    console.log(cover);
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}
module.exports = router;
