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
        var lastDay;
        // TODO: Move date functionality into a serivce. It'll be used practically
        // everywhere. Oh, and refactor this blasphemy.
        //
        // TODO: We shouldn't be needing to use moment in order to make the time
        // UTC. There's an issue with pg and it's parsing the dates from the db
        // incorrectly. This is a temporary fix until I can snipe the bug.
        all.map(function(item){
          item.date = moment.utc(item.published_at).format('LL');
          if (item.date == moment.utc(Date.now()).format('LL')){
            item.date = 'Today'
          } else if (item.date == moment.utc(Date.now()).subtract(1, 'days').format('LL')){
            item.date = 'Yesterday'
          }else{
            item.date = moment(item.date).format('dddd, LL');
          }
        });
        // There are strings and integers here - not so good.
        if (all.length) {
          lastDay = all[all.length - 1].date;
        }
        more = (all.length == (total[0].count - offset )) ? false : true;
        all = _.groupBy(all, 'date');
        res.json({flow: all, more: more, lastDay: lastDay});
      });
    });
  }else{
    Articles.recent(function(all) {
      Articles.totalPublished(function(total) {
        var flow = [], news = [], lastDay;
        // TODO: Move date functionality into a serivce. It'll be used practically
        // everywhere. Oh, and refactor this blasphemy.
        //
        // TODO: We shouldn't be needing to use moment in order to make the time
        // UTC. There's an issue with pg and it's parsing the dates from the db
        // incorrectly. This is a temporary fix until I can snipe the bug.
        all.map(function(item){
          item.date = moment.utc(item.published_at).format('LL');
          if (item.date == moment.utc(Date.now()).format('LL')){
            item.date = 'Today'
          } else if (item.date == moment.utc(Date.now()).subtract(1, 'days').format('LL')){
            item.date = 'Yesterday'
          }else{
            item.date = moment(item.date).format('dddd, LL');
          }
          if (item.news){
            news.push(item);
          }else{
            flow.push(item);
          }
        });
        if(flow.length){
          lastDay = flow[flow.length - 1].date;
        }
        more = (flow.length === parseInt(total[0].count)) ? false : true;
        flow = _.groupBy(flow, 'date');
        res.render('news/index', {flow_collection: flow, news_collection: news, more: more, lastDay: lastDay });
      });
    });
  }
});

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
