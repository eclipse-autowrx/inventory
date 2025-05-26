const convertUserHeader = (req, _, next) => {
  const userId = req.get('x-user-id');
  delete req.user;
  if (userId) {
    req.user = {
      id: userId,
    };
  }
  next();
};

module.exports = convertUserHeader;
