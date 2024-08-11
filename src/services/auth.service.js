const jwt = require("jsonwebtoken");

exports.generateState = (redirect_url) => {
  return redirect_url
    ? Buffer.from(JSON.stringify({ redirect_url })).toString("base64")
    : undefined;
};

exports.processGoogleCallback = (user, state) => {
  const { redirect_url } = state
    ? JSON.parse(Buffer.from(state, "base64").toString())
    : {};

  const token = generateJWT(user);

  return `${redirect_url ?? "/success"}?token=${token}`;
};

generateJWT = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
};
