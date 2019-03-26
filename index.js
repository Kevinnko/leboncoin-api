/*
Le package `dotenv` permet de definir des variables d'environnement
dans le fichier `.env`. Nous utilisons le fichier `.slugignore` pour ignorer
le fichier `.env` dans l'environnement Heroku
*/
require("dotenv").config();

/*
Le package `mongoose` est un ODM (Object-Document Mapping) permettant de
la manipulation des documents de la base de données comme si s'agissait d'objets
*/
const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true
  },
  function(err) {
    if (err) console.error("Could not connect to mongodb.");
  }
);

const express = require("express");
const app = express();

/*
Le package `helmet` est une collection de protections contre certaines
vulnérabilités HTTP
*/
const helmet = require("helmet");
app.use(helmet());

/*
Les réponses (> 1024 bytes) du serveur seront compressées au format GZIP pour
diminuer la quantité d'informations transmises
*/
const compression = require("compression");
app.use(compression());

// Parse le `body` des requêtes HTTP reçues
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" })); // L'upload est fixée à 50mb maximum (pour l'envoi de fichiers)

// Initialisation des models
const User = require("./models/User");

app.get("/", function(req, res) {
  res.send("Welcome to the leboncoin API.");
});

/*
`Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les
requêtes provenant d'un nom de domaine différent. Ici, nous autorisons l'API
à repondre aux requêtes AJAX venant d'autres serveurs.
*/
const cors = require("cors");
app.use("/api", cors());

// Les routes sont séparées dans plusieurs fichiers
const coreRoutes = require("./routes/home.js");
const userRoutes = require("./routes/user.js");
const offerRoutes = require("./routes/offer.js");

// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use("/api", coreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/offer", offerRoutes);

/*
Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
une erreur 404
*/
app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

/*
Le dernier middleware de la chaîne gérera les d'erreurs. Ce `error handler`
doit définir obligatoirement 4 paramètres `err, req, res, next`.
Définition d'un middleware : https://expressjs.com/en/guide/writing-middleware.html
*/
app.use(function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  // if (process.env.NODE_ENV === "production") err = "An error occurred";
  res.json({ error: err });
});

app.listen(process.env.PORT, function() {
  console.log(`leboncoin API running on port ${process.env.PORT}`);
  console.log(`Current environment is ${process.env.NODE_ENV}`);
});
