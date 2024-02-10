const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require("bcryptjs")

class UsersController {

  async index(request, response) {
    const users = await knex('users').orderBy('name')
    return response.json(users)
  }

  async show(request, response) {
    const { id } = request.user 
    const user = await knex('users').where({ id }).first()
    if(!user) {
      throw new AppError("Usuário não encontrado.")
    }

    return response.json(user)
  }

  async create(request, response) {
    const { name, email, password } = request.body 

    const checkUserExists = await knex("users").where({ email }).first()
    if(checkUserExists) {
      throw new AppError("Este e-mail já está em uso.")
    }

    const hashedPassword = await hash(password, 8)
    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    })
    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body 
    const { id } = request.user 

    const user = await knex('users').where({ id }).first()

    if(!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if( userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.")
    }

    if(password && old_password) {
      const checkedOldPassword = await compare(old_password, user.password)
      if(!checkedOldPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(password, 8)
    }

    await knex("users").update(user).where({ id })

    return response.json()

  }

  async delete(request, response) {
    const { id } = request.user 
    await knex('users').where({ id }).delete()
    return response.json()
  }

}

module.exports = UsersController