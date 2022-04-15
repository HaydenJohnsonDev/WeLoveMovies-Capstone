const knex = require("../db/connection");

function destroy (reviewId) {
    return knex("reviews").where({ review_id: reviewId }).del();
}

async function update (newBody) {
    const newReview = await knex("reviews")
        .select("*")
        .where({ review_id: newBody.review_id })
        .update(newBody, "*")
        .then((val) => val[0]);

    const critic = await knex("critics as c")
        .join("reviews as r", "c.critic_id", "r.critic_id")
        .select("c.*")
        .where({ "r.review_id": newBody.review_id })
        .then((val) => val[0]);

    return {
        ...newReview,
        critic
    }
}

module.exports = {
    destroy,
    update
}