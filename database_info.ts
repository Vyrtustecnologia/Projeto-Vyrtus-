
/**
 * Configurações para integração futura com PostgreSQL
 * IP: 192.168.0.21
 * Porta: 5432
 * Banco: teste
 * Usuário: postgree
 * Senha: Sutryv!2#4%6
 */

export const DB_CONFIG = {
  host: '192.168.0.21',
  port: 5432,
  database: 'teste',
  user: 'postgree',
  password: 'Sutryv!2#4%6',
  ssl: false // Geralmente false para self-hosted local
};

export const SCHEMA_MAP = {
  TABLE_CLIENTE: 'cliente',
  TABLE_SOLICITANTE: 'soliciante',
  TABLE_ATIVO: 'ativo',
  TABLE_CHAMADO: 'chamado',
  TABLE_TOPICO: 'topico',
  TABLE_TIPO: 'tipo',
  
  COLUMNS_CHAMADO: [
    'id', 'titulo', 'cliente_id', 'solicitante_id', 
    'ativo_id', 'topico_id', 'tipo_id', 'descricao',
    'status', 'usuario_alteracao_id' // Colunas adicionais necessárias
  ]
};
