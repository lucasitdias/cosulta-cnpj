import { cleanCNPJ, formatCNPJ } from '../utils/cnpjValidator';

/**
 * Normalizes raw API response into a unified structure for the UI
 */
function normalizeCnpjData(raw, providerName) {
  const clean = cleanCNPJ(raw.cnpj || '');
  
  // Normalize situation status
  let statusText = raw.descricao_situacao_cadastral || raw.situacao_cadastral || 'DESCONHECIDO';
  if (typeof statusText === 'number') {
    const statusMap = {
      1: 'NULA',
      2: 'ATIVA',
      3: 'SUSPENSA',
      4: 'INAPTA',
      8: 'BAIXADA'
    };
    statusText = statusMap[statusText] || 'DESCONHECIDO';
  }
  statusText = String(statusText).toUpperCase();

  // Normalize CNAE Principal
  const cnaePrincipal = {
    codigo: raw.cnae_fiscal || raw.cnae_principal?.codigo || raw.atividade_principal?.[0]?.code || '',
    descricao: raw.cnae_fiscal_descricao || raw.cnae_principal?.descricao || raw.atividade_principal?.[0]?.text || 'Não informada'
  };

  // Normalize CNAEs Secundários
  let cnaesSecundarios = [];
  if (Array.isArray(raw.cnaes_secundarios)) {
    cnaesSecundarios = raw.cnaes_secundarios.map(item => ({
      codigo: item.codigo || item.code || '',
      descricao: item.descricao || item.text || ''
    }));
  } else if (Array.isArray(raw.atividades_secundarias)) {
    cnaesSecundarios = raw.atividades_secundarias.map(item => ({
      codigo: item.code || item.codigo || '',
      descricao: item.text || item.descricao || ''
    }));
  }

  // Normalize QSA (Sócios)
  let qsa = [];
  if (Array.isArray(raw.qsa)) {
    qsa = raw.qsa.map(socio => ({
      nome: socio.nome_socio || socio.nome || socio.nome_socio_razao_social || 'Não informado',
      qualificacao: socio.qualificacao_socio || socio.qualificacao || socio.qualificacao_representante_legal || 'Sócio / Administrador',
      pais: socio.pais_origem || socio.pais || 'Brasil',
      faixa_etaria: socio.faixa_etaria || socio.faixa_etaria_socio || null,
      data_entrada: socio.data_entrada_sociedad || socio.data_entrada || null
    }));
  }

  // Format currency for capital social
  let capitalSocialNum = parseFloat(raw.capital_social || 0);
  let capitalSocialFormatted = isNaN(capitalSocialNum) || capitalSocialNum === 0 
    ? 'Não informado' 
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(capitalSocialNum);

  // Address assembly
  const logradouro = raw.logradouro || raw.descricao_logradouro || '';
  const numero = raw.numero || 'S/N';
  const complemento = raw.complemento ? `, ${raw.complemento}` : '';
  const bairro = raw.bairro || '';
  const municipio = raw.municipio || raw.localidade || '';
  const uf = raw.uf || raw.estado || '';
  const cep = raw.cep ? String(raw.cep).replace(/^(\d{5})(\d{3})$/, '$1-$2') : '';
  
  const enderecoCompleto = [
    `${logradouro}, ${numero}${complemento}`,
    bairro,
    `${municipio} - ${uf}`,
    cep ? `CEP: ${cep}` : ''
  ].filter(Boolean).join(' • ');

  // Contact
  let telefone = raw.ddd_telefone_1 || raw.telefone || raw.ddd_telefone_2 || '';
  if (telefone && !telefone.includes('(')) {
    const cleanTel = cleanCNPJ(telefone);
    if (cleanTel.length === 10) {
      telefone = `(${cleanTel.slice(0, 2)}) ${cleanTel.slice(2, 6)}-${cleanTel.slice(6)}`;
    } else if (cleanTel.length === 11) {
      telefone = `(${cleanTel.slice(0, 2)}) ${cleanTel.slice(2, 7)}-${cleanTel.slice(7)}`;
    }
  }

  return {
    cnpj: formatCNPJ(clean),
    cnpjRaw: clean,
    razaoSocial: raw.razao_social || raw.nome || 'Razão Social não informada',
    nomeFantasia: raw.nome_fantasia || raw.fantasia || 'Não informado',
    situacaoCadastral: statusText,
    dataSituacaoCadastral: raw.data_situacao_cadastral || raw.data_situacao || null,
    motivoSituacaoCadastral: raw.motivo_situacao_cadastral || null,
    dataAbertura: raw.data_inicio_atividade || raw.abertura || raw.data_abertura || null,
    porte: raw.porte || raw.porte_empresa || 'Não informado',
    naturezaJuridica: raw.natureza_juridica || 'Não informada',
    capitalSocial: capitalSocialFormatted,
    capitalSocialRaw: capitalSocialNum,
    cnaePrincipal,
    cnaesSecundarios,
    qsa,
    endereco: {
      logradouro,
      numero,
      complemento: raw.complemento || '',
      bairro,
      municipio,
      uf,
      cep,
      completo: enderecoCompleto
    },
    contato: {
      email: raw.email || raw.correio_eletronico || 'Não informado',
      telefone: telefone || 'Não informado'
    },
    meta: {
      provider: providerName,
      consultedAt: new Date().toISOString()
    }
  };
}

/**
 * Fetch CNPJ details with automatic fallback
 * Primary: BrasilAPI
 * Secondary: Minha Receita
 */
export async function fetchCNPJ(cnpjString) {
  const clean = cleanCNPJ(cnpjString);
  if (clean.length !== 14) {
    throw new Error('O CNPJ deve conter exatamente 14 dígitos numéricos.');
  }

  const errors = [];

  // Attempt 1: BrasilAPI
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return normalizeCnpjData(data, 'BrasilAPI');
    }

    if (response.status === 404) {
      throw new Error('CNPJ não encontrado na base de dados da Receita Federal.');
    }

    errors.push(`BrasilAPI respondeu com status ${response.status}`);
  } catch (err) {
    if (err.message.includes('não encontrado')) {
      throw err;
    }
    errors.push(`BrasilAPI erro: ${err.message}`);
  }

  // Attempt 2: Fallback to Minha Receita
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://minhareceita.org/${clean}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return normalizeCnpjData(data, 'Minha Receita (Fallback)');
    }

    if (response.status === 404) {
      throw new Error('CNPJ não encontrado na base de dados da Receita Federal.');
    }

    errors.push(`Minha Receita respondeu com status ${response.status}`);
  } catch (err) {
    if (err.message.includes('não encontrado')) {
      throw err;
    }
    errors.push(`Minha Receita erro: ${err.message}`);
  }

  throw new Error(`Não foi possível consultar os dados do CNPJ no momento. (${errors.join('; ')})`);
}

/**
 * Pre-defined list of example CNPJs for quick testing
 */
export const SAMPLE_CNPJS = [
  { name: 'Petrobras', cnpj: '33.000.167/0001-01', badge: 'Energia' },
  { name: 'Magazine Luiza', cnpj: '47.960.950/0001-21', badge: 'Varejo' },
  { name: 'Itaú Unibanco', cnpj: '60.701.190/0001-04', badge: 'Banco' },
  { name: 'Nubank (Nu Pagamentos)', cnpj: '18.284.400/0001-93', badge: 'Fintech' },
  { name: 'Google Brasil', cnpj: '06.990.590/0001-23', badge: 'Tech' }
];
