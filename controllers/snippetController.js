const User = require('../models/user');
const Snippet = require('../models/snippet');
const bodyParser = require('body-parser');


module.exports = {
  //--------API endpoints
  snippetRenderAPI: (req, res) =>{
    Snippet.find({}).then(snippet=>{
      res.status(200).json(snippet);
    })
  },
  snippetPostAPI: (req, res)=>{
    const snippet = new Snippet(req.body).save().then(snippet=>{
      res.status(201).json({});
    })
  },
  languageSnippetAPI: (req,res)=>{
    Snippet.find({language: req.params.language}).then(snippet=>{
      res.json(snippet);
    })
  },
  oneSnippetAPI: (req,res)=>{
    let id = req.params._id;
    Snippet.findOne({_id: req.params._id}).then(snippet=>{
      res.json(snippet);
    })
  },
  tagSnippetAPI: (req, res)=>{
    Snippet.find({tags: {$in: [req.params.tags]}}).then(snippet=>{
      res.json(snippet);
    })
  },
  //----------View Endpoints
  snippetRender: (req, res) =>{
    let context = {};
    Snippet.find({}).then(snippet=>{
      console.log(snippet);
      context.model = snippet;
      res.render('index', context)
    })
  },
  snippetPost: (req, res)=>{
    let context = {};
    const snippet = new Snippet({
      username: req.session.user,
      title: req.body.title,
      body: req.body.body,
      language: req.body.language,
      tags: req.body.tags.split(",")
    }).save().then(snippet=>{
      res.redirect('/snippets/');
    })
  },
  oneSnippet: (req,res)=>{
    let context = {};
    let id = req.params._id;
    Snippet.findOne({_id: req.params._id}).then(snippet=>{
      console.log(snippet);
      context.filterTitle = snippet.title
      context.model = snippet
      res.render('filter', context);
    })
  },
  languageSnippet: (req,res)=>{

    let context = {};

    Snippet.find({language: req.query.language}).then(snippet=>{
      console.log(snippet);
      req.params.language = snippet.language;

      context.filterTitle = req.query.language
      context.model = snippet
      res.render('filter', context)
    })
  },

  tagSnippet: (req, res)=>{
    let context = {};
    Snippet.find({tags: {$in: [req.query.tags]}}).then(snippet=>{
      console.log(snippet);
      context.filterTitle = req.query.tags
      context.model = snippet
      res.render('filter', context);
    })
  }
};
