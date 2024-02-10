const { Router } = require("express")
const usersRouter = require("./users.routes")
const movieRouter = require("./movie_notes.routes")
const movieTagsRouter = require("./movie_tags.routes")
const sessionsRouter = require("./sessions.routes")


const routes = Router()

routes.use("/users", usersRouter)
routes.use("/sessions", sessionsRouter)
routes.use("/movies", movieRouter)
routes.use("/tags", movieTagsRouter)

module.exports = routes