//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//=================Mongoose stuff======================


mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model('article', articleSchema);

article1 = new Article({title: 'Coronga Veros',
content: 'This is the Brazilian version of the corona virus.'});

//article1.save();

//Routing and HTTP methods

//=========Target all================

app.listen(3000, function(req, res){
  console.log('Server is listening on port 3000');
});

app.route('/articles')
.get(function(req, res){
  Article.find({}, function(err, results){
    if(err) res.send(err);
    else{
      res.send(results);
    }
  });
})
.post(function(req, res){
  const title = req.body.title;
  const content = req.body.content;

  console.log('Post request with the following title:', title);

  newArticle=new Article({title: title, content: content});
  newArticle.save(function(err){
    if(err) res.send(err);
    else res.send('Got it');
  });
})
.delete(function(req, res){
  Article.deleteMany({}, function(err){
    if(err){
      res.send(err);
      console.log(err);
    }
    else{
      res.send('All the articles have been deleted');
      console.log('All the articles have been deleted');
    }
  });
});

//==================Target especific=================

app.route('/articles/:title')

.get(function(req, res){
  const title=req.params.title;

  Article.findOne({title: RegExp(title,'i')}, function(err, result){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      if(result){
        console.log('Found article:', title);
        res.send(result);
      }else{
        res.send('No articles found with the title '+title);
      }
    }
  });
})

.put(function(req, res){
  Article.update({title: req.params.title},
  {
    title: req.body.title,
    content: req.body.content
  },
  { overwrite: true },
  function(err){
    if(err){
      res.send(err);
      console.log(err);
    }
    else{
      res.send(req.params.title+' updated');
      console.log(req.params.title+' updated');
    }
  });
})

.patch(function(req, res){
  Article.update({title: req.params.title},
  {$set: req.body },
  function(err){
    if(err){
      res.send(err);
      console.log(err);
    }
    else{
      res.send(req.params.title+' updated');
      console.log(req.params.title+' updated');
    }
  });
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.title}, function(err){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log('Deleted '+req.params.title);
      res.send('Deleted '+req.params.title);
    }
  });
});






//That's all, folks
