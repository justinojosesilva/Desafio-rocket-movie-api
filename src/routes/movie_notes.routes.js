const { Router } = require('express')
const MovieNotesController = require('../controllers/MovieNotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')  
const movieRoutes = Router()

const movieController = new MovieNotesController()

movieRoutes.use(ensureAuthenticated)
movieRoutes.get("/", movieController.index)
movieRoutes.get("/:id", movieController.show)
movieRoutes.post("/", movieController.create)
movieRoutes.put("/:id", movieController.update)
movieRoutes.delete("/:id", movieController.delete)


module.exports = movieRoutes