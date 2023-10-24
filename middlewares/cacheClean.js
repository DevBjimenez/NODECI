const { clearHash } = require("../services/cache")

async function cacheClean(req, res, next) {
    await next()
    clearHash(req.user.id)
}

module.exports = {
    cacheClean
}