module.exports = {
  server: {
    port: 3000,
    environment: 'development',
    cookieKey: 'somerandomstring',
    redis: '127.0.0.1',
    database: 'pg://localhost:5432/javascriptcom',

    basicAuth: {
      username: 'username',
      password: 'password'
    }
  },

  apiKeys: {
    /**
     * GitHub is used to authenticate and these fields are required to start the
     * application. You can fake these values but you will not be able to log
     * into the application without valid credentials.
     **/
    github: {
      clientId: '',
      clientSecret: ''
    },

    mailchimp: {
      key: '',
      listId: ''
    },

    akismet: '',
    mandrill: ''
  }
}
