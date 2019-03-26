const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploadPictures = require("../middlewares/uploadPictures");

// Import du modèle Offer :
const Offer = require("../models/Offer");

// Définition des routes :
router.get("/", function(req, res) {
  const filter = {};
  if (
    (req.query.priceMin !== undefined && req.query.priceMin !== "") ||
    (req.query.priceMax !== undefined && req.query.priceMax !== "")
  ) {
    filter.price = {};
    if (req.query.priceMin) {
      filter.price["$gte"] = req.query.priceMin;
    }

    if (req.query.priceMax) {
      filter.price["$lte"] = req.query.priceMax;
    }
  }

  if (req.query.title) {
    filter.title = {
      $regex: req.query.title,
      $options: "i"
    };
  }

  const query = Offer.find(filter).populate({
    path: "creator",
    select: "account"
  });

  if (req.query.skip !== undefined) {
    query.skip(parseInt(req.query.skip));
  }
  if (req.query.limit !== undefined) {
    query.limit(parseInt(req.query.limit));
  } else {
    // valeur par défaut de la limite
    query.limit(100);
  }

  switch (req.query.sort) {
    case "price-desc":
      query.sort({ price: -1 });
      break;
    case "price-asc":
      query.sort({ price: 1 });
      break;
    case "date-desc":
      query.sort({ created: -1 });
      break;
    case "date-asc":
      query.sort({ created: 1 });
      break;
    default:
  }

  query.exec(function(err, offers) {
    res.json(offers);
  });
});

router.get("/with-count", (req, res) => {
  console.log("api, req.query", req.query);
  // Offres avec tri
  const filter = {};
  if (
    (req.query.priceMin !== undefined && req.query.priceMin !== "") ||
    (req.query.priceMax !== undefined && req.query.priceMax !== "")
  ) {
    filter.price = {};
    if (req.query.priceMin) {
      filter.price["$gte"] = req.query.priceMin;
    }

    if (req.query.priceMax) {
      filter.price["$lte"] = req.query.priceMax;
    }
  }

  if (req.query.title) {
    filter.title = {
      $regex: req.query.title,
      $options: "i"
    };
  }
  // ??
  Offer.count({}, (err, count) => {
    const query = Offer.find(filter);
    // .populate({
    //   path: "creator",
    //   select: "account"
    // });

    if (req.query.skip !== undefined) {
      query.skip(parseInt(req.query.skip));
    }
    if (req.query.limit !== undefined) {
      query.limit(parseInt(req.query.limit));
    } else {
      // valeur par défaut de la limite
      query.limit(100);
    }

    switch (req.query.sort) {
      case "price-desc":
        query.sort({ price: -1 });
        break;
      case "price-asc":
        query.sort({ price: 1 });
        break;
      case "date-desc":
        query.sort({ created: -1 });
        break;
      case "date-asc":
        query.sort({ created: 1 });
        break;
      default:
    }

    query.exec((err, offers) => {
      console.log("offers (api) : ", offers);
      res.json({ count, offers });
    });
  });
});

// Page annonce :
router.get("/:id", (req, res, next) => {
  console.log("req.params ", req.params);
  Offer.findById(req.params.id)
    // .populate({ path: "creator", select: "account" })
    .exec(function(err, offer) {
      if (err) {
        return next(err.message);
      }
      if (!offer) {
        res.status(404);
        return next("Not found");
      } else {
        console.log("offer ", offer);
        return res.json(offer);
      }
    });
});

// Publier une annonce
router.post("/publish", isAuthenticated, uploadPictures, function(
  req,
  res,
  next
) {
  console.log("req.user : ", req.user);
  const obj = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    pictures: req.pictures,
    creator: req.user
  };
  const offer = new Offer(obj);
  offer.save(function(err) {
    if (!err) {
      return res.json({
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        pictures: offer.pictures,
        created: offer.created,
        creator: {
          account: offer.creator.account,
          _id: offer._id
        }
      });
    } else {
      return next(err.message);
    }
  });
});

module.exports = router;
