const crypto = require("crypto")
const connection = require("../database/connection")

module.exports = {
  async index (request, response) {
    const ongs = await connection('ong').select('*')

    return response.status(200).json(ongs)
  },

  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.body

    const id = crypto.randomBytes(4).toString('HEX')

    await connection('ong').insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf,
    }).catch(error => response.status(400).send())

    return response.status(201).json({ id })
  }
}