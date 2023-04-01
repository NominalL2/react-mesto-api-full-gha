module.exports = class ExistsEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
