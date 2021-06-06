var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const sequelize = Book.sequelize;
const {Op} = require('sequelize');

express.static('../public');

/**
 * GET request for home / index page
 * 
 * Upon GET request for /books, the application pulls total index of library.db records using Sequelize findAll() method. 
 * 
 * Upon completion of find, application displays the index view passing in allBooks  to determine how many page number need to be displayed as well as the limited books array.  Pagination is determined by dividing the total records by the limit length of the books array. 
 * 
 * Properties passed to the index view include title, books, perPage, allBooks, and searchPage. The searchPage property is useful to determine whether or not to display the page navigation below the table.
 */
router.get('/books', async function(req, res, next) {
  const perPage = 8;
  let page = req.params.page || 1;
  const allBooks = await Book.findAll();
  const books = await Book.findAll({
    order: sequelize.col('id'),
    limit: perPage,
    offset: (page * perPage) - perPage
  });
  res.render('index', {title: 'The Book Case', books , perPage, allBooks, searchPage: false})
});

/**
 * GET request for search feature
 * 
 * Upon GET request to books/search, the application pulls in the search input based on req.query. 
 * 
 * Using the Sequelize query object {where}, the application sorts through multiple columns using Op.or and Op.like to check if the query has a match or patial match in 'title', 'author', 'genre', and 'year'. 
 * 
 * The application response returns the index view supplying the results of the query rather than the full library.db index. Properties passed to the index view include the books array, perPage, title, and searchPage as a true value.
 * 
 */
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
  res.render('index', {title: 'The Book Case', books , perPage, searchPage: true, search})
})

/**
 * GET route for pagination display of Book entries.
 * 
 * On GET request to book/page=:page, the application replicates the display of the index page but supplies the results based on the page number in the req.params. The results are set to limit to 8 entries so offset is multiplied by the limit of 8 and substracted by 8 to show records 1-8 for page 1, 9-17 on page 2, etc..
 * 
 */
router.get('/books/page=:page', async function (req, res, next){
  const perPage = 8;
  let page = req.params.page || 1;
  const allBooks = await Book.findAll();
  const books = await Book.findAll({
    order: sequelize.col('id'),
    limit: perPage,
    offset: (page * perPage) - perPage
  });
  res.render('index', {title: 'The Book Case', books , perPage, allBooks})
})

/**
 * GET new book form page
 * 
 * Loads the empty form for adding a new Book model instance to the database on a GET request. Adding 'title' property to better 
 */
router.get('/books/new', async function (req, res, next) {
    res.render('new-book', { title: "Add A Book" })
})

/**
 * POST new book to library database
 * 
 * Upon receiving a POST request at /books/new this route tries to push a new Book model to library.db and redirects back to the index page.
 * 
 * The try / catch block is placed to ensure any model validation failure is addressed by passing SequelizeValidationErrors to the 'form-error' view. 
 */
router.post('/books/new', async function(req, res, next) {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch(error) {
    if (error.name === "SequelizeValidationError"){
      res.render('form-error', {errors: error.errors, title: "Add A Book", newBook: req.body})
    } else {
      next()
    }
  }
  
})

/**
 * GET update book form page
 * 
 * On GET request to books/:id, the application searches library.id for book with :id as property. If the book exists (i.e. does not return null), the application renders the update-book form passing in the Book instance and title.
 * 
 * Else if the :id provided is not found, the application passes the next() call to push to error handler.
 */
 router.get('/books/:id', async function (req, res, next) {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  if(book !== null){
    res.render('update-book', { book, title: "Edit Book" })
  } else{
    next()
  }
})

/**
 * POST / PUT update book form page
 * 
 * On POST request at books/:id, setting the Book instance's fields to the values received from req.body.
 * 
 * Try / catch block inserted to catch validation errors on edit of current listing. App will attempt to save the found record using the values form req.body then redirect to the index page. 
 * 
 * If validation fails, the app will render the form-error page passing along the validation errors along with the necessary book and title properties for the update book page.
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
      res.render('form-error', {book: record, errors: error.errors, title: "Edit Book"})
    } else {
      next()
    }
  }  
})

/**
 * DELETE / POST book form page
 * 
 * Uses req.params to pull specific Book instance with Sequelize findByPk() method.
 * 
 * Upon pulling specific instance in the table, the POST request calls the Sequelize destroy() method to remove the instance from library.db then redirects the application to the index page.
 */
 router.post('/books/:id/delete', async function (req, res, next) {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  await book.destroy();
  res.redirect('/books');
})


/**
 * REDIRECT to books page from index
 */
 router.get('/', async function(req,res,next) {
  res.redirect('/books')
})

module.exports = router;
