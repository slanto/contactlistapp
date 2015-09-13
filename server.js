var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/contactlist/:year?/:month?', function(req, res) {
  var criteria = {};

  if (req.params.year) {
    criteria.year = parseInt(req.params.year);
  }

  if (req.params.month) {
    criteria.month = parseInt(req.params.month);
  }

  db.contactlist.find(criteria, function(err, docs) {
    res.json(docs);
  });

});

app.post('/contactlist', function(req, res){
  db.contactlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.remove({ _id: mongojs.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  });
});

app.get('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.findOne({ _id: mongojs.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  })
});

app.put('/contactlist/:id', function(req, res) {
  var id = req.params.id;
  db.contactlist.findAndModify({
      query: {_id: mongojs.ObjectId(id)},
      update: { $set: {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
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
