function mainBackendAuth(
  req,
  res,
  next
) {
  const apiKey =
    req.headers["x-main-backend-key"];

  const expectedKey =
    process.env.MAIN_BACKEND_API_KEY;

  if (
    !expectedKey ||
    !apiKey ||
    apiKey !== expectedKey
  ) {
    return res.status(401).json({
      success: false,
      error:
        "Unauthorized main backend request"
    });
  }

  next();
}

module.exports = mainBackendAuth;
