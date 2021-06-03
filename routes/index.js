var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const sequelize = Book.sequelize;
const {Op} = require('sequelize');

express.static('../public');

/* GET home / books page. */
router.get('/books', async function(req, res, next) {
  const perPage = 8;
  let page = req.params.page || 1;
  const allBooks = await Book.findAll();
  const books = await Book.findAll({
    order: sequelize.col('id'),
    limit: perPage,
    offset: (page * perPage) - perPage
  });
  // limit and offset for next page based on the number per page
  res.render('index', {title: 'The Book Case', books , perPage, allBooks, searchPage: false})
});

// GET route for base user search
router.get('/books/search', async function (req, res, next){
  let search = req.query.search;
  const perPage = 8;
  let page = req.params.page || 1;
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        { title: {
        [Op.like]: '%' + search + '%'
        }},
        { author: {
          [Op.like]: '%' + search + '%'
        }},
        { genre: {
          [Op.like]: '%' + search + '%'
        }},
        { year: {
          [Op.like]: '%' + search + '%'
        }}]
    },
    order: sequelize.col('id')
  });
  // limit and offset for next page based on the number per page
  res.render('index', {title: 'The Book Case', books , perPage, searchPage: true, search})
})

// Get route implementing multiple pages of results
router.get('/books/page=:page', async function (req, res, next){
  const perPage = 8;
  let page = req.params.page || 1;
  const allBooks = await Book.findAll();
  const books = await Book.findAll({
    order: sequelize.col('id'),
    limit: perPage,
    offset: (page * perPage) - perPage
  });
  // limit and offset for next page based on the number per page
  res.render('index', {title: 'The Book Case', books , perPage, allBooks})
})

/**
 * GET new book form page
 */
router.get('/books/new', async function (req, res, next) {
    res.render('new-book', { title: "Add A Book" })
})

/**
 * POST new book to library database
 */
router.post('/books/new', async function(req, res, next) {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch(error) {
    if (error.name === "SequelizeValidationError"){
      res.render('form-error', {errors: error.errors, title: "Add A Book"})
    } else {
      next()
    }
  }
  
})

/**
 * GET update book form page
 */
 router.get('/books/:id', async function (req, res, next) {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  if(book !== null){
    res.render('update-book', { book })
  } else{
    next()
  }
})

/**
 * POST / PUT update book form page
 */
 router.post('/books/:id', async function (req, res, next) {
  const id = req.params.id;
  let record = await Book.findByPk(id);
  record.title = req.body.title;
  record.author = req.body.author;
  record.genre = req.body.genre;
  record.year = req.body.year;
  try{
    await record.save({fields: ['title', 'author', 'genre','year']});
    res.redirect('/books');
  } catch(error){
    if (error.name === "SequelizeValidationError"){
      res.render('form-error', {book: record, errors: error.errors})
    } else {
      next()
    }
  }  
})

/**
 * DELETE / POST book form page
 */
 router.post('/books/:id/delete', async function (req, res, next) {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  book.destroy();
  res.redirect('/books');
})


/**
 * REDIRECT to books page from index
 */
 router.get('/', async function(req,res,next) {
  res.redirect('/books')
})

module.exports = router;
