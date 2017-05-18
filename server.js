// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////
var db = require('./models')


//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));


////////////////////
//  ROUTES
///////////////////


// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    // populate fills in the author id with all the author data
    .populate('author')
    .exec(function(err, books){
      if (err) { return console.log("index error: " + err); }
      res.json(books);
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  console.log('books show', req.params);
  var bookId = req.params.id;

  db.Book.findOne( {_id: bookId})
  .populate('author')
  .exec( function (err, foundBook) {
      if (err) { return console.log(err); }
      res.json(foundBook);
    });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  console.log('books create', req.body);
  var newBook = new db.Book({
    title:req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });

  // find by author
  db.Author.findOne({name: req.body.author}, function(err, author){
    if(err) { return console.log(err); }
    // add this Author
    newBook.author = author;
    // save NewBook to database
    newBook.save(function(err, book){
      if (err) { return console.log(err);
      }
      console.log("saved", book.title);
      res.json(book);
    });
  });

});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  console.log('books update', req.params.id);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  var updateBook = {
    task: req.body.task,
      description: req.body.description
  }
  db.Book.findOneAndUpdate({_id: bookId }, updateBook, { new: true}, function(err, updatedBook){
    if(err){return console.log(err)}
      res.json(updatedBook);
  })
});

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOneAndRemove({_id:bookId}, function(err, deletedBook) {
    res.json(deletedBook);
  })

});



app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
