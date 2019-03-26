const mongoose = require("mongoose");

// Création du modèle
const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    account: {
      username: String,
      phone: String
    }
  },
  created: Date,
  pictures: Array
});

module.exports = Offer;
