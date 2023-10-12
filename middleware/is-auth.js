const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
const authHeader = req.get("Authorization");
if(!authHeader){
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
}
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
  } catch (err) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    error.message = "Hubo un problema de autenticacion, por favor vuelve a inicar sesión";
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;

  next();
};
