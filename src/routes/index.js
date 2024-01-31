const { Router } = require("express")
const usersRouter = require("./users.routes")
const movieRoutes = require("./movie_notes.routes")
const movieTagsRoutes = require("./movie_tags.routes")


const routes = Router()

routes.use("/users", usersRouter)
routes.use("/movies", movieRoutes)
routes.use("/tags", movieTagsRoutes)

module.exports = routes