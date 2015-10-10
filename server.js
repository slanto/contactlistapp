var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contactlist');
var db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function() {
  console.log("Connection to \"contactlist\" is open...");

  var contactListSchema = mongoose.Schema({
   year: Number,
   month: Number,
   created: {type: Date, default: Date.now },
   type: Number,
   name: String,
   email: String,
   amount: {
     type: Number,
     get: function(value) {
       return value / amountFactor;
     }
   }
 });

 var contactTypeSchema = mongoose.Schema({
   value: Number,
   name: String,
   default: Boolean,
   icon: String
 });

 ContactList = mongoose.model('contactlist', contactListSchema);
 ContactType = mongoose.model('contacttype', contactTypeSchema)
})

var amountFactor = 1000;

app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

app.get('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  ContactList.findById(id).exec(function(err, doc) {
    doc.amount = doc.amount;// / amountFactor;    
    res.json(doc);
  });
});

app.get('/contactlist/:year?/:month?', function(req, res) {
  var criteria = {};

  if (req.params.year) {
    criteria.year = parseInt(req.params.year);
  }

  if (req.params.month) {
    criteria.month = parseInt(req.params.month);
  }

  var totalAmount = 0;
  var result = {};

  ContactList.find(criteria).sort({ created: -1}).exec(function(err, contacts) {
    if (err) return handleError(err);

    //res.json(contacts);
    contacts.forEach(function(doc, index) {
        totalAmount += doc.amount;
        doc.amount = doc.amount;// / amountFactor;
      })

      result.items = contacts;
      result.totalAmount = totalAmount;// / amountFactor;
      res.json(result);
  });
});

var getAmount = function(str) {
  return str * amountFactor;
};

app.post('/contactlist', function(req, res){
  var row = req.body;
  row.amount = getAmount(row.amount);
  ContactList.create(row, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  ContactList.remove({ _id: mongoose.Types.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  ContactList.update({_id: mongoose.Types.ObjectId(id)}, {
        name: req.body.name,
        email: req.body.email,
        amount: getAmount(req.body.amount),
        year: req.body.year,
        month: req.body.month,
        created: req.body.created,
        type: req.body.type
      }, function(err, doc){
        res.json(doc);
      });
});

app.get('/contacttype', function(req, res) {
    ContactType.find(function(err, docs) {
        res.json(docs);
    });
});

app.listen(3000, function() {
  console.log('Server running on port 3000');
});
