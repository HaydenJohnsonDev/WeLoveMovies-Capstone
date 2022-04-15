const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");
const db = require("../db/connection");

async function reviewExists (req, res, next) {
    const { reviewId } = req.params;
    const review = await db("reviews").where({ review_id: reviewId }).first();
    if (!review) {
        return next({
            status: 404,
            message: "Review cannot be found."
        })
    }
    res.locals.reviewId = reviewId;
    next();
}

async function destroy (req, res) {
    const methodName = "list";
    req.log.debug({ __filename, methodName });

    await service.destroy(req.params.reviewId);
    res.sendStatus(204).json({ data: "No Content" });

    req.log.trace({ __filename, methodName, return: true });
}

async function update (req, res) {
    const reviewId = res.locals.reviewId;
    const newReview = {
        ...req.body.data,
        review_id: reviewId
    }

    const data = await service.update(newReview);
    res.json({ data });
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)]
}