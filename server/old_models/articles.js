var slugGenerator = require(path.join(__dirname, '..', 'services', 'slug-generator'));
var mongo = require("mongodb");
var objectId = mongo.ObjectID;

var Articles = {
  paginate(date, cb) {
    var collection = mongo.DB.collection('articles');
    var query;
    if(date){
      query = {'published_at':{$lt: new Date(parseInt(date))}, approved: true}
    }else{
      query = { approved: true }
    }
    var sortBy = { 'published_at': -1 }
    collection.find(query).sort(sortBy).limit(26).toArray(function(err, docs){
      // This is a hacky way to determine if there are more docuemnts left to
      // be paginated. We limit to 26 but only display 25. As long as there are
      // more than 25 docs, then we display the more button.
      var hasMore = docs.length > 25 ? true : false
      // Remove the last element, we only use it to check for more.
      if (docs.length > 25){docs.pop()}
      cb(err, docs, hasMore);
    });
  },

  create(args, cb) {
    var collection = mongo.DB.collection('articles');
    var doc = {
      'title': args.title,
      'body': args.body,
      'url': args.url,
      'slug': slugGenerator.createSlug(args.title),
      'approved': false,
      'published_at': null,
      'user': {
        'user_id': args.user.uid,
        'name': args.user.displayName,
        'email': args.user.email,
        'avatar_url': args.user['_json'].avatar_url
      },
      'comment_count': 0,
      'comments': []
    };

    collection.insertOne(doc, function(err, res){
      cb(err);
    });
  },

  findBySlug(slug, cb){
    var collection = mongo.DB.collection('articles');
    var query = {'slug': slug};
    collection.find(query).limit(1).next(function(err, doc){
      cb(err, doc)
    });
  },

  addComment(comment, user, cb){
    var collection = mongo.DB.collection('articles');
    var query = {'slug': comment.slug};
    var update = {
      '$push': {
        'comments': {
          'id': new objectId(),
          'flagged': comment.isSpam,
          'body': comment.body,
          'published_at': comment.date,
          'user': {
            'id': new objectId(user.uid),
            'name': user.displayName,
            'avatar_url': user['_json'].avatar_url
          }
        }
      },
      '$inc':{'comment_count': 1}
    };
    var options = {
      'projection':{comments: {$slice: -1}, _id: 1},
      'returnOriginal': false
    };
    collection.findOneAndUpdate(query, update, options, function(err, doc){
      cb(err, doc)
    });
  },

  editComment(args, cb) {
    var collection = mongo.DB.collection('articles');
    var commentId = new objectId(args.commentId);
    var currentUserId = new objectId(args.userId);
    var query = {comments : {$elemMatch: {id: commentId, 'user.id': currentUserId}}}
    var options = { projection : {'comments.$': 1}};
    var update = {
      $set: {'comments.$.body': args.updatedComment}
    }

    collection.findOneAndUpdate(query, update, options, function(err,doc){
      if(err) { cb(err) }

      cb(err, doc);
    });
  },

  deleteComment(args, cb) {
    var collection = mongo.DB.collection('articles');
    var commentId = new objectId(args.commentId);
    var currentUserId = new objectId(args.userId);
    var query = {comments : {$elemMatch: {id: commentId, 'user.id': new objectId(currentUserId)}}}
    var update = {
      $pull: {comments:{id: commentId}},
      $inc: {comment_count: -1}
    }

    collection.findOneAndUpdate(query, update, function(err){
      cb(err);
    });
  },

  // Returns stories that haven't been moderated.
  pending(cb) {
    var collection = mongo.DB.collection('articles');
    var query = {approved: false};

    collection.find(query).toArray(function(err, docs){
      cb(err, docs)
    });
  },

  approve(id, cb) {
    var collection = mongo.DB.collection('articles');
    var mongoId = objectId.createFromHexString(id);
    var query = {'_id': mongoId}
    var update = {$set:{approved: true, published_at: new Date()}}

    collection.findOneAndUpdate(query, update, function(err, doc){
      cb(err, doc)
    });
  },

  deny(id, cb) {
    var collection = mongo.DB.collection('articles');
    var mongoId = objectId.createFromHexString(id);
    var query = {'_id': mongoId}
    var update = {$set:{approved: false}}

    collection.findOneAndUpdate(query, update, function(err, doc){
      cb(err, doc)
    });
  }
}
module.exports = Articles;
