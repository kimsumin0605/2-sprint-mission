const logger = (req, res, next) => {
  const requestTime = new Date().toISOString();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
//미들웨어