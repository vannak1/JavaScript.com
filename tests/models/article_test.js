var app = require('./../../server/app');
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var models  = require('./../../server/models');
var Article = models.Article;

describe('Article', function() {
  var article;

  beforeEach(function(done) {
    Article.sync({ force : true }) // drops table and re-creates it
    .then(function() {
      done();
    });
  });

  describe('attributes', function(){
    before(function(done) {
      Article.create({
        approved: false,
        slug: 'this-is-slug',
        title: 'Noooooode',
        body: 'so so good',
        url: 'http://example.com',
        user_id: 1,
        published_at: new Date('2016')
      }).then(function(_article) {
        article = _article.get({plain: true});
        done();
      });
    });

    it('sets correct attributes', function() {
      expect(article.approved).to.eq(false)
      expect(article.slug).to.eq('this-is-slug')
      expect(article.title).to.eq('Noooooode')
      expect(article.body).to.eq('so so good')
      expect(article.url).to.eq('http://example.com')
      expect(article.user_id).to.eq(1)
      expect(article.published_at).to.eq(new Date('2016'))
    });
  });

  // describe('attribute requirments', function() {
  //   it('requires a github_id', function(done){
  //     User.create({
  //       email: 'test@example.com',
  //       name: 'tester',
  //       avatar_url: 'http://somewhere.com'
  //     }).catch(function (err) {
  //       expect(err['name']).to.be.equal('SequelizeValidationError');
  //       done();
  //     });
  //   });

  //   it('requires a name', function(done){
  //     User.create({
  //       github_id: 1,
  //       email: 'test@example.com',
  //       avatar_url: 'http://somewhere.com'
  //     }).catch(function (err) {
  //       expect(err['name']).to.be.equal('SequelizeValidationError');
  //       done();
  //     });
  //   });

  //   it('requires an avatar_url', function(done){
  //     User.create({
  //       github_id: 1,
  //       name: 'tester',
  //       email: 'test@example.com'
  //     }).catch(function (err) {
  //       expect(err['name']).to.be.equal('SequelizeValidationError');
  //       done();
  //     });
  //   });
  // });
});
