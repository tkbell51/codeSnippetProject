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
    const context = {};
    context.session = req.session.user
    Snippet.find({}).then(snippet=>{
      console.log(snippet);
      context.model = snippet;
      res.render('index', context)
    })
  },
  newSnippetRender:(req,res)=>{
    const context = {};
    context.session = req.session.user;
    res.render('newSnippet', context);
  },
  snippetCreate: (req, res)=>{
    let tagsBody = req.body.tags
    let modelTags = tagsBody.split(' ')
    const snippet = new Snippet({
      username: req.session.user,
      title: req.body.title,
      body: req.body.snippet,
      language: req.body.language,
      tags: modelTags,
      notes: req.body.notes

    });
    snippet.save().then(snippet=>{
      res.redirect('/snippets/');
    })
  },


  oneSnippet: (req,res)=>{
    const context = {};
    context.session = req.session.user
    let id = req.params._id;
    Snippet.findOne({_id: req.params._id}).then(snippet=>{
      console.log(snippet);
      context.filterTitle = snippet.title
      context.model = snippet
      res.render('oneSnippet', context);
    })
  },
  languageSnippet: (req,res)=>{
const context = {};
context.session = req.session.user
    Snippet.find({language: req.query.language}).then(snippet=>{
      console.log(snippet);
      req.params.language = snippet.language;

      context.filterTitle = req.query.language
      context.model = snippet
      res.render('filter', context)
    })
  },

  tagSnippet: (req, res)=>{
    const context = {};
    context.session = req.session.user
    Snippet.find({tags: {$in: [req.query.tags]}}).then(snippet=>{
      console.log(snippet);
      context.filterTitle = req.query.tags
      context.model = snippet
      res.render('filter', context);
    })
  },
  userSnippet:(req,res)=>{
    const context = {};
    context.session = req.session.user
    Snippet.find({username: req.params.username}).then(snippet=>{
      console.log(snippet);
      context.filterTitle = snippet.username;
      context.model = snippet;
      res.render('filter', context);
    })
  },
  sessSnippet:(req,res)=>{
    const context = {};
    context.session = req.session.user
    Snippet.find({username: req.params.username}).then(snippet=>{
      
      console.log(snippet);
      context.filterTitle = snippet.username;
      context.model = snippet;
      res.render('filter', context);
    })
  }
};
