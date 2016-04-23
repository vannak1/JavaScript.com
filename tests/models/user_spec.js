var app = require('./../../server/app');
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var models  = require('./../../server/models');
var User = models.User;

describe('User', function() {

  beforeEach(function(done) {
    User.sync({ force : true }) // drops table and re-creates it
    .then(function() {
      done();
    });
  });

  describe('attributes', function(){
    before(function(done) {
      User.create({
        github_id: 123,
        email: 'test@example.com',
        name: 'tester',
        avatar_url: 'http://somewhere.com'
      }).then(function(_user) {
        user = _user.get({plain: true});
        done();
      });
    });

    it('sets correct attributes', function() {
      expect(user.admin).to.eq(false)
      expect(user.github_id).to.eq(123)
      expect(user.name).to.eq('tester')
      expect(user.email).to.eq('test@example.com')
      expect(user.avatar_url).to.eq('http://somewhere.com')
    });
  });

  describe('attribute requirments', function() {
    it('requires a github_id', function(done){
      User.create({
        email: 'test@example.com',
        name: 'tester',
        avatar_url: 'http://somewhere.com'
      }).catch(function (err) {
        expect(err['name']).to.be.equal('SequelizeValidationError');
        done();
      });
    });

    it('requires a name', function(done){
      User.create({
        github_id: 1,
        email: 'test@example.com',
        avatar_url: 'http://somewhere.com'
      }).catch(function (err) {
        expect(err['name']).to.be.equal('SequelizeValidationError');
        done();
      });
    });

    it('requires an avatar_url', function(done){
      User.create({
        github_id: 1,
        name: 'tester',
        email: 'test@example.com'
      }).catch(function (err) {
        expect(err['name']).to.be.equal('SequelizeValidationError');
        done();
      });
    });
  });

 describe('#findOrCreate', function() {
   describe('new user', function() {
     it('creates a new user', function(done) {
       var user = { github_id: 123, email: 'test@example.com', name: 'tester', avatar_url: 'http://somewhere.com' }

       User.afterCreate(function(user, {transaction: t} ) { setTimeout(function(){user.email = 'jajajaja'; }, 3) });

       User.findOrCreate({where: { github_id: user.github_id }, defaults: user, { transaction: t }})
       .spread(function(_user, created) {
         expect(created).to.eq(true);
         expect(_user.email).to.eq('jajajaja')
       });
     });
   });
 });
});
