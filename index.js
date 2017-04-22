var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var cors = require('cors');

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials: true");
  res.header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.use(cors());

app.use(express.static(__dirname + '/public'));

var Rows = mongoose.model('Rows',{
  City: String,
  Country: String,
  CourseDescription: String,
  CourseName: String,
  Currency: String,
  EndDate: Date,
  StartDate: Date,
  Price: String,
  University: String
});

function GetRows(req, res){
  Rows.find({}).exec(function (err, result) {
    res.send(result);
  })
}

mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost:27017/adcore", function(err){
  if(!err){
    console.log("connected to mongo");
  }
});

app.post('/api/create', function(req, res){
  console.log(req.body);
  var rows = new Rows(req.body);



  res.status(200).send('created');
  rows.save();
});

app.get('/api/read', GetRows);

app.post('/api/update', function (req, res) {
  console.log(req.body);
  Rows.findById(req.body[0]._id, function (err, todo) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      todo.Price = req.body[0].Price || todo.Price;
      todo.Currency = req.body[0].Currency || todo.Currency;
      todo.StartDate = req.body[0].StartDate || todo.StartDate;
      todo.EndDate = req.body[0].EndDate || todo.EndDate;
      todo.CourseDescription = req.body[0].CourseDescription || todo.CourseDescription;
      res.status(200).send('updated');
      todo.save();
    }
  });
});

app.post('/api/delete', function (req, res) {
  var rows = new Rows(req.body);
  rows.remove(req.body, function (err, result) {
      if(!err) {
        res.send(result);
        res.status(200);
      }
      console.log(err);
  });
});


app.listen(port, function () {
  console.log('On port' + prot);
});
