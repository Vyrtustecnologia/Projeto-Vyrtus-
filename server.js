
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Vyrtus rodando na porta ${PORT}`);
});
