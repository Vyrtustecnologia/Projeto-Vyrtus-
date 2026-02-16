
/**
 * Configurações para integração com PostgreSQL (Self-Hosted)
 */

export const DB_CONFIG = {
  host: '192.168.0.21',
  port: 5432,
  database: 'teste',
  user: 'postgree',
  password: 'Sutryv!2#4%6',
  ssl: false
};

/**
 * RELAÇÃO ENTRE CAMPOS DO SISTEMA E COLUNAS DO BANCO
 * Chave: Propriedade no React (Frontend)
 * Valor: Coluna no PostgreSQL (Backend)
 */
export const FIELD_MAPPING = {
  ticket: {
    id: 'id',
    title: 'titulo',
    clientId: 'cliente_id',
    requesterId: 'solicitante_id',
    assetId: 'ativo_id',
    labelId: 'topico_id',
    typeId: 'tipo_id',
    description: 'descricao',
    status: 'status',
    lastUpdatedById: 'usuario_alteracao_id'
  },
  client: {
    id: 'id',
    name: 'nome'
  },
  asset: {
    id: 'id',
    clientId: 'cliente_id',
    type: 'tipo',
    brand: 'marca',
    model: 'modelo'
  }
};

/**
 * DICIONÁRIO DE IDS PARA ENUMS (Relacionando Enums do sistema com IDs do Postgres)
 */
export const ENUM_TO_ID = {
  topicos: {
    'Cloud': 1,
    'Alarmes': 2,
    'Sistemas Operacionais': 3,
    'Rede': 4,
    'Hardware': 5,
    'Segurança': 6
  },
  demandas: {
    'Relato de Problema': 1,
    'Configuração/Alteração': 2,
    'Implantação': 3,
    'Descarte de Equipamentos': 4,
    'Documentação': 5,
    'Instrução/Informação ao Usuário': 6
  }
};
