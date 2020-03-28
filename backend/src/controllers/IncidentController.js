const connection = require("../database/connection")

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query

    const [count] = await connection('incident').count()

    const incidents = await connection('incident')
      .select([
        'incident.*', 
        'ong.name', 
        'ong.email', 
        'ong.whatsapp', 
        'ong.city', 
        'ong.uf'
      ])  
      .join('ong', 'ong.id', '=', 'incident.ong_id')
      .limit(5)
      .offset((page - 1) * 5)

    response.header('X-Total-Count', count['count(*)'])

    return response.json(incidents).status(200)
  },

  async create(request, response) {
    const { title, description, value } = request.body
    const ong_id = request.headers.authorization

    const [id] = await connection('incident').insert({
      title,
      description,
      value,
      ong_id
    }).catch(error => response.status(400).send())

    return response.status(201).json({ id })
  },

  async delete(request, response) {
    const { id } = request.params
    const ong_id = request.headers.authorization

    const incident = await connection('incident')
      .select('ong_id')
      .where('id', id)
      .first()

    if (incident.ong_id !== ong_id) {
      return response.status(401).json({ error: "Operation not permitted." })
    }

    await connection('incident').where('id', id).delete().catch(error => response.status(400).send())

    return response.status(204).send()
  }
}