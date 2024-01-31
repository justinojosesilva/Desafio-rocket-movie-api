const { Router } = require('express')
const MovieNotesController = require('../controllers/MovieNotesController')
const movieRoutes = Router()

const movieController = new MovieNotesController()

movieRoutes.get("/", movieController.index)
movieRoutes.get("/:id", movieController.show)
movieRoutes.post("/:user_id", movieController.create)
movieRoutes.delete("/:id", movieController.delete)


module.exports = movieRoutes