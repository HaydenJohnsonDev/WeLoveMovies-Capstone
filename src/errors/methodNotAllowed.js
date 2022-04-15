function methodNotAllowed(request, _response, next) {
  return next({
    status: 405,
    message: `${request.method} not allowed for ${request.originalUrl}`,
  });
}
  
module.exports = methodNotAllowed;