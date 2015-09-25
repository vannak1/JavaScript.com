var express = require('express');
var router  = express.Router();
var path    = require('path');
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: false });
var Articles = require(path.join(__dirname, '..', 'services', 'articles'));
var Users = require(path.join(__dirname, '..', 'services', 'users'));
var Comments = require(path.join(__dirname, '..', 'services', 'comments'));
var moment = require('moment');
var _ = require('lodash');
var mcapi = require('mailchimp-api');

mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API);

/* GET home page. */
router.get('/', parseForm, function(req, res) {
  var offset = req.query.page;
  var more;
  if (offset) {
    Articles.paginated(offset, function(all) {
      Articles.totalPublished(function(total) {
        more = (all.length == (total[0].count - offset )) ? false : true;
        res.json({flow: all, more: more});
      });
    });
  }else{
    Articles.recent(function(all) {
      Articles.totalPublished(function(total) {
        var flow = [], news = [];
        all.map(function(item){
          if (item.news){
            news.push(item);
          }else{
            flow.push(item);
          }
        });
        more = (flow.length === parseInt(total[0].count)) ? false : true;
        res.render('news/index', {flow_collection: flow, news_collection: news, more: more});
      });
    });
  }
}).

/* POST subscribe an email to JS6 list. */
router.post('/subscribe', parseForm, function(req, res) {
  mc.lists.subscribe(
    {
      id: process.env.LIST_ID,
      email: {email:req.body.email},
      double_optin: false,
      send_welcome: true
    },
    function(data) {
      res.json({data: data});
    },
    function(error) {
      res.json({error: error});
    });
});

module.exports = router;
