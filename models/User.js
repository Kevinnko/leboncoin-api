const mongoose = require("mongoose");

// Création du modèle
const User = mongoose.model("User", {
  email: String,
  hash: String,
  salt: String,
  token: String
});

module.exports = User;
