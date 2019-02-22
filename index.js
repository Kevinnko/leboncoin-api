const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(bodyParser());

// Connecter la DB
mongoose.connect("mongodb://localhost/leboncoin-copycat", {
  useNewUrlParser: true
});

/*
Le package `helmet` est une collection de protections contre certaines
vulnérabilités HTTP
*/
var helmet = require("helmet");
app.use(helmet());

/*
Les réponses (> 1024 bytes) du serveur seront compressées au format GZIP pour
diminuer la quantité d'informations transmises
*/
var compression = require("compression");
app.use(compression());

// Parse le `body` des requêtes HTTP reçues
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" })); // L'upload est fixée à 50mb maximum (pour l'envoi de fichiers)

// Initialiser les modèles
const User = require("./models/User");
const Offer = require("./models/Offer");

// Importer les routes

// Définir les routes :
// 1 - voir les offres
app.get("/offer/with-count", (req, res) => {
  console.log("voici les offres");
});
// 2 - voir une page offre
app.get("/offer/:id", (req, res) => {
  console.log("voici une offre");
});

// 3 - Créer un compte / Sign-up
app.post("/sign_up", (req, res) => {
  console.log("voici l'offre particuliere");
});
// 4 - Se connecter / Log-in
app.post("/log_in", (req, res) => {
  console.log("ok");
});
// 5 - Publier une annonce / Publish
app.post("/publish", (req, res) => {
  console.log("ok");
});

// Lancer le server
app.listen(3001, () => {
  console.log("server started");
});
