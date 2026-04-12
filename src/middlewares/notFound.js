const notFound = (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route không tồn tại",
  });
};

module.exports = notFound;