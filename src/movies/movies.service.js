const knex = require("../db/connection");

function list (check) {
    if (check) {
        return knex("movies as m")
            .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
            .select("m.*")
            .where({ "mt.is_showing": true })
            .groupBy("m.movie_id");
    }
    return knex("movies")
        .select("*");
}

function read (movieId) {
    return knex("movies")
        .where({ movie_id: movieId})
        .then((value) => value[0]);
}

function readReviews (movieId) {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*")
        .where({ movie_id: movieId });
}
function readCritics (movieId) {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("c.*")
        .where({ movie_id: movieId });
}

function readTheaters (movieId) {
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .select("*")
        .where({ "mt.movie_id": movieId });
}

module.exports = {
    list,
    read,
    readReviews,
    readCritics,
    readTheaters
}