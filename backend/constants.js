const linkPattern = /^(http|https):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;
const idPattern = /^[0-9a-fA-F]{24}$/;
const MONGO_DB = process.env.MONGO_DB ? process.env.MONGO_DB : 'mongodb://127.0.0.1:27017/mestodb';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'some_secret_key';

module.exports = {
  linkPattern,
  idPattern,
  MONGO_DB,
  JWT_SECRET,
};
