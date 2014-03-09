var config = {
  user: 'mygmailname@gmail.com',
  password: 'mygmailpassword',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

exports.config = config;