
const db = require('../config/db');

class TicketController {
  async store(req, res) {
    const { titulo, descricao, prioridade, cliente_id, agente_id } = req.body;
    try {
      const query = `
        INSERT INTO chamados (titulo, descricao, prioridade, cliente_id, agente_id, usuario_atualizacao_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const values = [titulo, descricao, prioridade, cliente_id, agente_id, req.userId];
      const result = await db.query(query, values);
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async index(req, res) {
    try {
      const query = `
        SELECT c.*, cl.nome as cliente_nome, u.nome as agente_nome 
        FROM chamados c
        JOIN clientes cl ON cl.id = c.cliente_id
        LEFT JOIN usuarios u ON u.id = c.agente_id
        ORDER BY c.data_criacao DESC`;
      const result = await db.query(query);
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { titulo, descricao, status, prioridade, agente_id } = req.body;
    try {
      const query = `
        UPDATE chamados 
        SET titulo = $1, descricao = $2, status = $3, prioridade = $4, agente_id = $5, usuario_atualizacao_id = $6
        WHERE id = $7 RETURNING *`;
      const values = [titulo, descricao, status, prioridade, agente_id, req.userId, id];
      const result = await db.query(query, values);
      return res.json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TicketController();
