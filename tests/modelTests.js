const User = require('../models/user');
const Snippet = require('../models/snippet')
const request = require('supertest');
const app = require('../app');

const userController = require('../controllers/userController');
const createUser = require('../controllers/helpers').createUser;
const createPasswordHashObject = require('../controllers/helpers').createPasswordHashObject;
const login = require('../controllers/helpers').login;

const expect = require('chai').expect;


//-------Snippet Model Tests-----------//
describe('snippet model tests', ()=>{
  beforeEach((done)=>{
      Snippet.deleteMany({}).then(done());
    });

    afterEach((done)=>{
      Snippet.deleteMany({}).then(done());
    });

    it("test should clean up after itself", (done)=>{
      const snippet = new Snippet().save().then(newSnippet=>{
        Snippet.count().then(count=>{
          expect(count).to.equal(1);

        });
      });
      done();
    });
it('can create a snippet in the db and find it with mongoose syntax',(done)=>{
  let snippet = new Snippet({userId: '12345', name:'test snippet', body:'let test = 2 + 2', language: 'Javascript', tags: ['Javascript', 'test'], notes: ['this is a test'] }).save().then(newSnippet =>{
    expect(newSnippet.name).to.equal('test snippet');
    expect(newSnippet.notes).to.equal('this is a test');
  })
  done();
})

})

//---------User Model Tests-----------//
describe("user model test", ()=>{

  afterEach((done)=>{
    User.deleteMany({}).then(done());
  });

  it('will not login if invalid user',(done)=>{
      login('peanut', 'greenies').then(result=> {
        expect(result).to.equal(false)
      })
      done();
    })

  it('will not login if invalid password', (done)=>{
  createUser('peanut', 'quincy', 'greenies').then(user=>{
    login('peanut', 'skateboard').then(result=> {
      expect(result).to.equal(false);
    })
  })
  done();
})

  it('can login and return true if valid login', (done)=>{
    createUser('peanut', 'greenies', 'parker').then(user =>{
      console.log(user);
      login('peanut', 'greenies').then(result => {
        expect(result).to.equal(true);
      })
    })
    done();
  })

  it('can generate a password object from password string', (done) => {
    const passwordObject = createPasswordHashObject("peanut", "a");
    const expectedHashObject = {salt: "a", iterations: 100, hash: "jnB+rZt2ved0J0R47XXaTQJl+UJE2fJljqsZTIMKJ1qdMaDcC5aOCZtpCPYBySyyvmEDpt55XTYBbYW+UFAg6LF7bkDGVPPu2YDch3nmYrB+5iGF+EVYxaqKWFdTUyGV/AGogfaUvjKnROFy1JIhF1G4g1B5a1SgA2dqYQeVeOOktpYC8vV3BVDgNpohjM0bXvCl+fQ2zxY7c8UwQ+/ofnW3ou/LWz9eKYzQTVLCJdgqWO6oSE+KRFlK3JZaE2HrczHVr6lsY/Y+XVMM8E0zkIsG0pebd55uj11DrygebeleYPBBajBcN8atyFhs0c0YU98ATrddcOplFLLwBCI2Qw=="};
    expect(passwordObject).to.not.equal(null);
    expect(passwordObject).to.deep.equal(expectedHashObject);
    done();
  });

  it('can create a user in mongo', (done) =>{
    createUser('username', 'password', 'joe').then(user=>{
      expect(user.username).to.equal('username');
      expect(user.firstName).to.equal('joe');
      expect(user.password).to.be.an('object');
      expect(user.password).hash.length.to.equal(344);
    })
    done();
  })
})


describe("basic api endpoint test", () =>{
  it("can access api endpoint and get success back", (done)=>{
    request(app)
    .get("/api/sanity")
    .expect(200, {hello: 'tim'}, done);
  });
});


describe("sanity test", ()=>{
  it("should run test", ()=>{
    expect(1).to.not.equal(2);
  });
});
