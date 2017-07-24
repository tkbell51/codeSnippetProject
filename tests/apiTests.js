const User = require('../models/user');
const Snippet = require('../models/snippet')
const request = require('supertest');
const app = require('../app');

const userController = require('../controllers/userController');
const createUser = require('../controllers/helpers').createUser;
const createPasswordHashObject = require('../controllers/helpers').createPasswordHashObject;
const login = require('../controllers/helpers').login;

const expect = require('chai').expect;


describe("basic api endpoint data test", ()=>{
  beforeEach(done => {
    Snippet.insertMany([
      {userId: '12345', name:'test snippet', body:'let test = 2 + 2', language: 'Javascript', tags: ['Javascript', 'test'], notes: ['this is a test'] },
      {userId: '54321', name:'another test', body:'<small> Hello World</small>', language: 'HTML', tags: ['HTML', 'test'], notes: ['introduction'] },
      {userId: '56789', name:'yep its a test', body:'main{display:flex,justify-content:center,}', language: 'CSS', tags: ['CSS', 'test'], notes: ['good ol flexbox'] }
    ]).then(done());
  })

  afterEach(done=>{
    Snippet.deleteMany({}).then(done());
  });

  it("snippets api endpoint allows creation of snippets", (done)=>{
    request(app)
    .post("/api/snippets/")
    .send({userId: '09876', name:'post test', body:'const express = require(express)', language: 'Javascript', tags: ['Javascript', 'test', 'node'], notes: ['this is a api post test'] })
    .expect(201)
    .expect(res =>{
      Snippet.count().then(count=> {
        expect(count).to.equal(4);
      })
    })
    .end(done);
  });
 //supertest test
  it("snippets api endpoint returns all snippets as json", (done)=>{
    request(app)
    .get("/api/snippets/")
    .expect(200)
    .expect(res => {
      expeect(res.body[0].name).to.equal("test snippet");
      expect(res.body[1].name).to.equal("another test");
      expect(res.body[2].name).to.equal("yep its a test")
    }).end(done);
  });
});
