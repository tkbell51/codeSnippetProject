const User = require('../models/user');
const Snippet = require('../models/snippet')
const request = require('supertest');
const app = require('../app');
// const snippetController = require('../controllers/snippetController');
// const userController = require('../controllers/userController');
const createUser = require('../controllers/helpers').createUser;
const createPasswordHashObject = require('../controllers/helpers').createPasswordHashObject;
const login = require('../controllers/helpers').login;

const expect = require('chai').expect;


describe("basic api endpoint data test", ()=>{
  beforeEach(done => {
    Snippet.insertMany([
      {username: 'tim', title:'test snippet', body:'let test = 2 + 2', language: 'Javascript', tags: ['Javascript', 'test'], notes: ['this is a test'] },
      {username: 'quinton', title:'another test', body:'<small> Hello World</small>', language: 'HTML', tags: ['HTML', 'test'], notes: ['introduction'] },
      {username: 'tim', title:'yep its a test', body:'main{display:flex,justify-content:center,}', language: 'CSS', tags: ['CSS', 'test'], notes: 'good ol flexbox' }
    ]).then(done());
  })

  afterEach(done=>{
    Snippet.deleteMany({}).then(done());
  });

  it("snippets api endpoint allows creation of snippets", (done)=>{
    // let snippetTest = new Snippet();
    request(app)
    .post("/api/snippets/create")
    .send({username:'nicole', title:'post test', body:'const express = require(express)', language: 'Javascript', tags: ['Javascript', 'test', 'node'], notes: 'this is a api post test' })
    .expect(res =>{
      expect(201)
      Snippet.count().then(count => {
          expect(count).to.equal(4);
      })
    })
    .end(done);
});

 //supertest test
  it("snippets api endpoint returns all snippets as json", (done)=>{
    request(app)
    .get("/api/snippets/all")
    .expect(200)
    .expect(res => {
      // console.log(res);
        expect(res.body[0].title).to.equal("test snippet");
        expect(res.body[1].title).to.equal("another test");
        expect(res.body[2].title).to.equal("yep its a test");
      }).end(done);
  });

  it("snippets api endpoint returns all snippets with language Javascript", (done)=>{
    request(app)
    .get("/api/snippets/language/Javascript")
    .expect(200)
    .expect(res =>{
        expect(res.body[0].title).to.equal("test snippet");
      }).end(done);
    })


  it("snippets api endpoint returns all snippets with tag CSS", (done)=>{
    request(app)
    .get("/api/snippets/tags/CSS")
    .expect(200)
    .expect(res =>{
        expect(res.body[0].body).to.equal('main{display:flex,justify-content:center,}');
        expect(res.body[0].title).to.not.equal('jumper');
      }).end(done);
    })

    it("snippets api endpoint returns one snippet by id", (done)=>{
      request(app)
      .get("/api/snippets/id/597b7d7d74c2dc1b99fdd167")
      .expect(200)
      .expect(res=>{
        expect(res.body.title).to.equal('let test = 2 + 2');
      }).end(done);
    })

});
