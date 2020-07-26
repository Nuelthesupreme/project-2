const express = require("express");
// Using axios for getting routes
const axios = require("axios");
// Using the router in express
const router = express.Router();

// Using the isAuthenticated middleware to check if the user is authenticated then go to the next function
const isAuthenticated = require("../middleware/isAuthenticated");
// Getting our model for our table
const Games = require("../models/games");

// Using our base url and appending our apikey and another query
const baseUrl = "https://www.giantbomb.com/api/";
const apiKey = `?api_key=${process.env.API_KEY}`;
const limitAndJson = "&format=json";

// First route to the dashboard if the user is logged in
router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.render("login");
});

// Login route redirecting to the dashboard if the user is logged in

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  }
  res.render("login");
});

// Sign up route redirecting to the dashboard if the user is logged in

router.get("/signup", (req, res) => {
  res.render("signup");
});

// Route to log out and send to the log in page

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Dashboard page where all the year buttons are

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const year = [];
  for (let i = 2000; i < 2021; i++) {
    year.push({ name: i });
  }
  res.render("dashboard", {
    genres: year,
  });
});

// Route to the game once the user has clicked on the year, it adds it into the url as a parameter

router.get("/year/:id", async (req, res) => {
  // async await axios call with our url and filter
  const response = await axios({
    url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${req.params.id}-01-01`,
    method: "GET",
  });

  // Renders the games page with the response data

  res.render("games", {
    game: response.data.results,
  });
});

// Get route on the /profile page if the user is authenticated. It gets the user id and finds all the games
// they have added to their profile and renders it on the page using sequelize

router.get("/profile", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;
  const response = await Games.findAll({
    where: { user_id },
    raw: true,
  });
  res.render("profile", { response });
});

// Route to add to favourites on the profile page and unfavourite the game

router.post("/profile/:id", isAuthenticated, async (req, res) => {
  const { favourite_game, game_id } = req.body;
  if (favourite_game === "1") {
    Games.update({ favourite_game: false }, { where: { game_id } }).then(() =>
      res.redirect("/profile")
    );
  }
  if (favourite_game === "0") {
    Games.update({ favourite_game: true }, { where: { game_id } }).then(() =>
      res.redirect("/profile")
    );
  }
});

// Post route to the /game page where it allows users to search for their releases, games, consoles etc

router.post("/game", isAuthenticated, async (req, res) => {
  const { search, searchOptions } = req.body;
  let response;
  switch (searchOptions) {
    case "releases":
      response = await axios({
        url: `${baseUrl}releases${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "game-name":
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "year":
      parseInt(search);
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=original_release_date:${search}-01-01`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
    case "platform":
      response = await axios({
        url: `${baseUrl}platforms${apiKey}${limitAndJson}&filter=name:${search}`,
        method: "GET",
      });
      res.render("console", {
        console: response.data.results,
      });
      break;
    case "platformGames":
      response = await axios({
        url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${search}`,
        method: "GET",
      });
      res.render("game", {
        game: response.data.results,
      });
      break;
  }
});

// Route to get /game/id

router.get("/game/:id", isAuthenticated, async (req, res) => {
  const response = await axios({
    url: `${baseUrl}games${apiKey}${limitAndJson}&filter=platforms:${req.params.id}`,
    method: "GET",
  });
  res.render("game", {
    game: response.data.results,
  });
});

// Route to post the games to the users profile

router.post("/year/:id", isAuthenticated, async (req, res) => {
  const { game_id, game_name } = req.body;

  const cb = (result) => {
    // Redirecting to the dashboard
    res.redirect("/dashboard");
  };

  const payload = {
    game_id,
    game_name,
    genre: req.params.id,
    user_id: req.user.id,
    favourite_game: false,
  };
  // Creating new item in the table using the Games model
  Games.create(payload).then(cb);
});

// Exports the router

module.exports = router;
