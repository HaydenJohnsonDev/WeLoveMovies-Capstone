const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");
const db = require("../db/connection");

async function reviewExists (req, res, next) {
    const methodName = "reviewExists";
    req.log.debug({ __filename, methodName, params: req.params });

    const error = {status: 404, message: "Review cannot be found."};
    const { reviewId } = req.params;
    
    const review = await db("reviews").where({ review_id: reviewId }).first();
    if (!review) {
        req.log.trace({ __filename, methodName, return: false }, error.message);
        return next(error);
    }
    res.locals.reviewId = reviewId;
    req.log.trace({ __filename, methodName, return: true });
    next();
}

async function destroy (req, res) {
    const methodName = "destroy";
    req.log.debug({ __filename, methodName, params: req.params });

    await service.destroy(req.params.reviewId);
    res.sendStatus(204).json({ data: "No Content" });

    req.log.trace({ __filename, methodName, return: true });
}

async function update (req, res) {
    const methodName = "update";
    req.log.debug({ __filename, methodName, params: req.params, body: req.body });

    const reviewId = res.locals.reviewId;
    const newReview = {
        ...req.body.data,
        review_id: reviewId
    }

    const data = await service.update(newReview);
    res.json({ data: data });
    req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)]
}