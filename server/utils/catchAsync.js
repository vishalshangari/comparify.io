// Wrapper to catch and propogate errors inside async route handlers

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
