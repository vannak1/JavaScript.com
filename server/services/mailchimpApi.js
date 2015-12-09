var mcapi = require('mailchimp-api');
var mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API);

var mailchimpApi = {
  subscribe(email, cb) {
    mc.lists.subscribe(
      {
        id: process.env.LIST_ID,
        email: {email: email},
        double_optin: false,
        send_welcome: true
      },
      function(data) {
        cb(null, data);
      },
      function(error) {
        cb(error, null)
      }
    )
  }
}
module.exports = mailchimpApi;
