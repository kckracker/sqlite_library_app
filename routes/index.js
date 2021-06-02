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
  console.log(books.length);
  // limit and offset for next page based on the number per page
  res.render('index', {title: 'The Book Case', books , perPage, allBooks, searchPage: false})
});

// GET route for user search
router.get('/books/search', async function (req, res, next){
  let search = req.query.search;
  const perPage = 8;
  let page = req.params.page || 1;
  const allBooks = await Book.findAll({
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
    }
  });
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
    order: sequelize.col('id'),
    limit: perPage,
    offset: (page * perPage) - perPage
  });
  // limit and offset for next page based on the number per page
  res.render('index', {title: 'The Book Case', books , perPage, allBooks, searchPage: true})

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
    res.render('new_book', { title: "Add A Book" })
})

/**
 * POST new book to library database
 */
router.post('/books/new', async function(req, res, next) {
  Book.create(req.body);
  res.redirect('/books');
})

/**
 * GET update book form page
 */
 router.get('/books/:id', async function (req, res, next) {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  res.render('update_book', { book:book.dataValues })
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
  await record.save({fields: ['title', 'author', 'genre','year']});
  res.redirect('/books');
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
