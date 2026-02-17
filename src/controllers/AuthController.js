
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: user.id, perfil: user.perfil },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        user: { id: user.id, nome: user.nome, perfil: user.perfil },
        token
      });
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}

module.exports = new AuthController();
