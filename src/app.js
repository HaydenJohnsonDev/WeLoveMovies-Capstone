if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();

const router = express.Router()

const cors = require("cors");
const logger = require("./config/logger");

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");

// Using logger for requests and adding CORS to application routes.
app.use(logger);
app.use(cors());

// Routers
app.use(express.json());

// For initial load of deployed backend. 
router.get('/', cors(), (req, res) => {
    res.json({ message: 'Hello Heroku!' });
})
  
// Available routes.
app.use('/', router);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

// Not found handler.
app.use((request, _response, next) => {
    next({ status: 404, message: `Not found: ${request.originalUrl}` });
});
  
// Error handler.
app.use((error, _request, response, _next) => {
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).json({ error: message });
});

module.exports = app;
