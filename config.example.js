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
    mailchimp: {
      key: '',
      listId: ''
    },

    github: {
      clientId: '',
      clientSecret: ''
    },

    akismet: '',
    mandrill: ''
  }
}
