const User = require('../models/user');
const Snippet = require('../models/snippet');

module.exports = {



  apiSnippetRender: (req, res) =>{

    Snippet.find({}).then(snippet=>{
      res.json(snippet);
    })


},

  //POST	/activities	Create a new snippet for me to track.
  apiSnippetPost: (req, res)=>{

    const snippet = new Snippet({
      name: req.body.name,
      trackedStats: req.body.trackedStats,
    }).save().then(snippet=>{
      res.json(snippet)
    })
    Snippet.create({})

},
  //GET	/activities/{id}	Show information about one snippet I am tracking, and give me the data I have recorded for that snippet.
  apiOneSnippet: (req,res)=>{

    Snippet.findOne({_id: req.params.id}).then(snippet=>{
      res.json(snippet);
    })

  

}
};
