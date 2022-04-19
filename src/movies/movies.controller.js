const service = require("./movies.service");
const db = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// GET - list all movies / GET with query 'is_showing' - list all movies with is_showing = true.
async function list (req, res) {
    const methodName = "list";
    req.log.debug({ __filename, methodName });

    let {is_showing} = req.query;

    if (is_showing) {
        const data = await service.list(true);
        res.status(200).json({ data: data });
        req.log.trace({ __filename, methodName, return: true, data });
    } else {
        const data = await service.list(false);
        res.status(200).json({ data: data });
        req.log.trace({ __filename, methodName, return: true, data });
    }
}

// Validation middleware to check if a movie is included in the database.
async function movieExists (req, res, next) {
    const methodName = "movieExists";
    req.log.debug({ __filename, methodName });

    const error = { status: 404, message: `Movie cannot be found.`}
    const { movieId } = req.params;

    if (!movieId) {
        req.log.trace({ __filename, methodName, return: false }, error.message);
        return next(error)
    }

    const movie = await db("movies").where({ movie_id: movieId }).first();
    if (!movie) {
        req.log.trace({ __filename, methodName, return: false }, error.message);
        return next(error)
    };

    res.locals.movie = movie;
    req.log.trace({ __filename, methodName, return: true }); 
    next();
}

// GET with param 'movieId' - gets a specified movie.
function read (req, res) {
    const methodName = "read";
    req.log.debug({ __filename, methodName, params: req.params });

    const movie = res.locals.movie;
    res.status(200).json({ data: movie });

    req.log.trace({ __filename, methodName, return: true, movie });
}

// GET with params 'movieId' and 'reviews' - gets reviews for specified movie.
async function readReviews (req, res) {
    const methodName = "readReviews";
    req.log.debug({ __filename, methodName, params: req.params });

    const reviewData = await service.readReviews(req.params.movieId);
    const criticData = await service.readCritics(req.params.movieId);

    const data = reviewData.map((review) => {
        let critic = criticData.find((critic) => review.critic_id === critic.critic_id);
        return {
            ...review,
            critic
        }
    })

    res.status(200).json({ data: data });
    req.log.trace({ __filename, methodName, return: true, data });
}

// GET with params 'movieId' and 'theaters' - gets all theaters showing specified movie.
async function readTheaters (req, res) {
    const methodName = "readTheaters";
    req.log.debug({ __filename, methodName, params: req.params });

    const data = await service.readTheaters(req.params.movieId);
    res.status(200).json({ data: data });
    req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), read],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)]
}