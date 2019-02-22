const mongoose = require("mongoose");

// Création du modèle
const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  picture: String
});

module.exports = Offer;
