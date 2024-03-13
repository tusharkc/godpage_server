function errorHandler(err, req, res, next) {
  console.error("Error caught by errorHandler:", err.message);
  console.error("Status code:", err.status || 500);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}

module.exports = errorHandler;
