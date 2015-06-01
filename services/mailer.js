var mandrill = require('node-mandrill')(process.env.MANDRILL_API);
// TODO: DRY it
var Mailer = {
  postAccepted(url, userEmail) {
    mandrill('/messages/send-template', {
      template_name: 'notification-approved',
      template_content: [], // required
      message: {
        to: [{email: userEmail}],
        from_email: 'support@javascript.com',
        from_name: 'Javascript',
        subject: "Your JavaScript.com story is approved!",
        merge_vars: [{
          rcpt: userEmail,
          vars: [{
                  name: "ARTICLE_URL",
                  content: url
                }]
        }]
      }
    }, function(error, response)
    {
      //uh oh, there was an error
      if (error) console.log( JSON.stringify(error) );

      //everything's good, lets see what mandrill said
      else console.log(response);
    });
  },
  postDenied(url, userEmail) {
    mandrill('/messages/send', {
      template_name: 'notification-unapproved',
      template_content: [ ],
      message: {
        to: [{email: userEmail}],
        from_email: 'support@javascript.com',
        from_name: 'Javascript',
        subject: "Unable to post your JavaScript.com story",
        merge_vars: [
          {
            rcpt: userEmail,
            vars: [
              {
                name: "ARTICLE_URL",
                content: url
              }
            ]
          }
        ]
      }
    }, function(error, response)
    {
      //uh oh, there was an error
      if (error) console.log( JSON.stringify(error) );

      //everything's good, lets see what mandrill said
      else console.log(response);
    });
  }
}

module.exports = Mailer;
