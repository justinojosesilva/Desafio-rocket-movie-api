const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {

  async show(request, response) {
    const { id } = request.params 
    const { id:user_id } = request.user
    const movie = await knex("movie_notes").where({ id, user_id }).first()
    const tags = await knex("movie_tags").where({ note_id: id, user_id }).orderBy("name")

    return response.json({
      ...movie,
      tags
    })
  }

  async index(request, response) {
    const { title, tags } = request.query 
    const user_id = request.user.id   

    let movies 

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())
      movies = await knex("movie_tags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.user_id",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title")
    } else {
      movies = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    }
    const userTags = await knex('movie_tags').where({ user_id })
    const movieNotesTags = await movies.map(movie => {
      const tagsMovieNotes = userTags.filter( tag => tag.note_id === movie.id)
      return {
        ...movie,
        tags: tagsMovieNotes
      }
    })
    return response.json(movieNotesTags)
  }

  async create(request, response) {
    const { title, description, rating, tags } = request.body 
    const { id:user_id } = request.user 

    const [ note_id ] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        name,
        note_id,
        user_id
      }      
    })
    await knex("movie_tags").insert(tagsInsert)

    return response.json()
  }

  async update(request, response) {
    const user_id = request.user.id
    const { id } = request.params
    const { title, rating, description, tags } = request.body

    const movie = await knex('movie_notes').where({ id }).first()

    if(!movie) {
      throw new AppError('Filme não encontrado')
    }

    movie.title = title ?? movie.title
    movie.rating = rating ?? movie.rating
    movie.description = description ?? movie.description

    await knex("movie_notes").update(movie).where({ id })

    await knex("movie_tags").where({ note_id: id }).delete()

    const tagsInsert = tags.map(name => {
      return {
        name,
        note_id: id,
        user_id
      }      
    })
    await knex("movie_tags").insert(tagsInsert)

    return response.json()
  }

  async delete(request, response) {
    const { id } = request.params
    await knex("movie_notes").where({ id }).delete()
    return response.json()
  }

}

module.exports = MovieNotesController