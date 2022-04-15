const knex = require("../db/connection");

async function list () {
    const movies = await knex("movies as m")
        .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
        .select("*");

    const theaters = await knex("theaters")
        .select("*");

    const data = theaters.map((theater) => {
        let moviesForTheater = movies.filter((movie) => movie.theater_id === theater.theater_id);
        return {
            ...theater,
            movies: [...moviesForTheater]
        }
    });

    return data;
}

module.exports = {
    list
}