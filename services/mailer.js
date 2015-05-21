var mandrill = require('node-mandrill')(process.env.MANDRILL_API);
var mailer = {
  postAccepted() {
    mandrill('/messages/send-template', {
      template_name: 'post-approved',
      template_content: [
        {
          // Not completely sure what Mandril wants here. 
          name: "",
          // Not completely sure what Mandril wants here. 
          content: ""
        }
      ],
      message: {
        to: [{email: 'joel@codeschool.com', name: 'Joel Taylor'}],
        from_email: 'javascript@codeschool.com',
        subject: "add-a-subject"
        text: "Hello, I sent this message using mandrill.",
        merge_vars: [
          {
            rcpt: "recipient email",
            vars: [
              {
                something: "the value",
                again: "more value"
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
  },
  postDenied() {
    mandrill('/messages/send', {
      template_name: 'post-denied',
      template_content: [
        {
          // Not completely sure what Mandril wants here. 
          name: "",
          // Not completely sure what Mandril wants here. 
          content: ""
        }
      ],
      message: {
        to: [{email: 'joel@codeschool.com', name: 'Joel Taylor'}],
        from_email: 'javascript@codeschool.com',
        subject: "add-a-subject"
        text: "Hello, I sent this message using mandrill.",
        merge_vars: [
          {
            rcpt: "recipient email",
            vars: [
              {
                something: "the value",
                again: "more value"
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

//send an e-mail to jim rubenstein
module.exports = Mailer;
