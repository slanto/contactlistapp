var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

app.get('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.findOne({ _id: mongojs.ObjectId(id) }, function(err, doc) {
    doc.amount = doc.amount / 1000;
    res.json(doc);
  })
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

  db.contactlist.find(criteria).toArray(function(err, docs) {
    docs.forEach(function(doc, index) {
      totalAmount += doc.amount;
      doc.amount = doc.amount / 1000;
    })

    result.items = docs;
    result.totalAmount = totalAmount / 1000;
    res.json(result);
  });
});


var getAmount = function(str) {
  return str * 1000;
};

app.post('/contactlist', function(req, res){
  var row = req.body;
  row.amount = getAmount(row.amount);
  db.contactlist.insert(row, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.remove({ _id: mongojs.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.findAndModify({
      query: {_id: mongojs.ObjectId(id)},
      update: { $set: {
        name: req.body.name,
        email: req.body.email,
        amount: getAmount(req.body.amount),
        year: req.body.year,
        month: req.body.month,
        created: req.body.created
      }},
      new: true
  }, function(err, doc) {
    res.json(doc);
  });
});

app.listen(3000, function() {
  console.log('Server running on port 3000');
});
