
const { Router } = require('express');
const AuthController = require('./controllers/AuthController');
const TicketController = require('./controllers/TicketController');
const authMiddleware = require('./middlewares/authMiddleware');

const routes = new Router();

// Rota pública
routes.post('/login', AuthController.login);

// Rotas protegidas
routes.use(authMiddleware);

// Chamados
routes.post('/chamados', TicketController.store);
routes.get('/chamados', TicketController.index);
routes.put('/chamados/:id', TicketController.update);

// Aqui você adicionaria CRUD de Clientes e Usuários seguindo o mesmo padrão

module.exports = routes;
