import React, { useState } from 'react';
import { 
  Building, Users, Briefcase, MapPin, Download, Star, 
  Copy, Check, FileJson, ExternalLink, Calendar, DollarSign,
  ShieldCheck, AlertTriangle
} from 'lucide-react';
import { generateCNPJPDF } from '../utils/pdfExport';

export default function CnpjDetails({ data, isFavorite, onToggleFavorite }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'qsa' | 'cnae' | 'address'
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'ATIVA': return 'ativa';
      case 'BAIXADA':
      case 'INAPTA':
      case 'NULA': return 'baixada';
      case 'SUSPENSA': return 'suspensa';
      default: return 'ativa';
    }
  };

  const handleCopySummary = () => {
    const summary = `
CNPJ: ${data.cnpj}
Razão Social: ${data.razaoSocial}
Nome Fantasia: ${data.nomeFantasia}
Situação Cadastral: ${data.situacaoCadastral} (${data.dataSituacaoCadastral || 'N/A'})
Data de Abertura: ${data.dataAbertura || 'N/A'}
CNAE Principal: ${data.cnaePrincipal?.codigo} - ${data.cnaePrincipal?.descricao}
Endereço: ${data.endereco.completo}
Contato: ${data.contato.email} | ${data.contato.telefone}
Capital Social: ${data.capitalSocial}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CNPJ_${data.cnpjRaw}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // OpenStreetMap embed URL
  const addressQuery = encodeURIComponent(`${data.endereco.logradouro}, ${data.endereco.numero}, ${data.endereco.municipio} - ${data.endereco.uf}, Brasil`);
  const mapUrl = `https://www.google.com/maps?q=${addressQuery}&output=embed`;

  return (
    <div className="cnpj-details-card glass-panel animate-fade-in">
      {/* Header Section */}
      <div className="company-header">
        <div className="company-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-tag ${getStatusClass(data.situacaoCadastral)}`}>
              {data.situacaoCadastral === 'ATIVA' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
              {data.situacaoCadastral}
            </span>
            <span className="company-cnpj-code">{data.cnpj}</span>
          </div>

          <h2 className="company-name">{data.razaoSocial}</h2>
          {data.nomeFantasia && data.nomeFantasia !== 'Não informado' && (
            <p className="company-fantasia">Fantasia: {data.nomeFantasia}</p>
          )}
        </div>

        <div className="company-header-actions">
          <button 
            className="action-btn"
            onClick={() => onToggleFavorite(data)}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            style={{ color: isFavorite ? '#eab308' : 'inherit' }}
          >
            <Star size={18} fill={isFavorite ? '#eab308' : 'none'} />
            <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </button>

          <button 
            className="action-btn"
            onClick={handleCopySummary}
            title="Copiar dados formatados em texto"
          >
            {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button 
            className="action-btn"
            onClick={handleDownloadJSON}
            title="Exportar dados em JSON"
          >
            <FileJson size={18} />
            <span>JSON</span>
          </button>

          <button 
            className="action-btn"
            style={{ background: 'var(--brand-gradient)', color: '#fff', border: 'none' }}
            onClick={() => generateCNPJPDF(data)}
            title="Baixar comprovante cadastral em PDF"
          >
            <Download size={18} />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Building size={18} />
          <span>Visão Geral</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'qsa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qsa')}
        >
          <Users size={18} />
          <span>Sócios / QSA ({data.qsa.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'cnae' ? 'active' : ''}`}
          onClick={() => setActiveTab('cnae')}
        >
          <Briefcase size={18} />
          <span>Atividades ({1 + data.cnaesSecundarios.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          <MapPin size={18} />
          <span>Endereço & Contato</span>
        </button>
      </div>

      {/* Tab 1: Visão Geral */}
      {activeTab === 'general' && (
        <div className="info-grid animate-fade-in">
          <div className="info-item">
            <span className="info-label">CNPJ</span>
            <span className="info-value highlight">{data.cnpj}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Situação Cadastral</span>
            <span className="info-value">{data.situacaoCadastral}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Data da Situação</span>
            <span className="info-value">{data.dataSituacaoCadastral || 'Não informada'}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Data de Abertura</span>
            <span className="info-value">{data.dataAbertura || 'Não informada'}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Capital Social</span>
            <span className="info-value highlight">{data.capitalSocial}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Porte da Empresa</span>
            <span className="info-value">{data.porte}</span>
          </div>

          <div className="info-item" style={{ gridColumn: 'span 2' }}>
            <span className="info-label">Natureza Jurídica</span>
            <span className="info-value">{data.naturezaJuridica}</span>
          </div>

          <div className="info-item" style={{ gridColumn: 'span 2' }}>
            <span className="info-label">CNAE Principal</span>
            <span className="info-value">
              {data.cnaePrincipal.codigo ? `${data.cnaePrincipal.codigo} - ` : ''}
              {data.cnaePrincipal.descricao}
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Quadro de Sócios (QSA) */}
      {activeTab === 'qsa' && (
        <div className="animate-fade-in">
          {data.qsa && data.qsa.length > 0 ? (
            <div className="qsa-grid">
              {data.qsa.map((socio, idx) => (
                <div key={idx} className="qsa-card">
                  <div className="qsa-avatar">
                    {socio.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>{socio.nome}</h4>
                    <p style={{ color: 'var(--brand-primary)', fontSize: '0.825rem', fontWeight: '600' }}>
                      {socio.qualificacao}
                    </p>
                    <p style={{ color: 'var(--text-subtle)', fontSize: '0.775rem', marginTop: '4px' }}>
                      País de Origem: {socio.pais}
                    </p>
                    {socio.faixa_etaria && (
                      <p style={{ color: 'var(--text-subtle)', fontSize: '0.775rem' }}>
                        Faixa Etária: {socio.faixa_etaria}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="info-item" style={{ textAlign: 'center', padding: '2rem' }}>
              <Users size={32} style={{ margin: '0 auto 8px auto', color: 'var(--text-subtle)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Não foram encontrados dados de quadro de sócios (QSA) para este CNPJ.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: CNAE / Atividades Econômicas */}
      {activeTab === 'cnae' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginBottom: '0.5rem', fontWeight: '700' }}>
              ATIVIDADE ECONÔMICA PRINCIPAL
            </h4>
            <div className="cnae-card glass-card">
              <span className="cnae-code-badge">{data.cnaePrincipal.codigo || 'S/N'}</span>
              <p style={{ fontWeight: '600', fontSize: '1rem' }}>{data.cnaePrincipal.descricao}</p>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginBottom: '0.5rem', fontWeight: '700' }}>
              ATIVIDADES ECONÔMICAS SECUNDÁRIAS ({data.cnaesSecundarios.length})
            </h4>

            {data.cnaesSecundarios.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.cnaesSecundarios.map((item, idx) => (
                  <div key={idx} className="cnae-card glass-card">
                    <span className="cnae-code-badge">{item.codigo}</span>
                    <p style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.descricao}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
                Nenhuma atividade econômica secundária cadastrada.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Endereço & Contato */}
      {activeTab === 'address' && (
        <div className="animate-fade-in">
          <div className="info-grid" style={{ marginBottom: '1rem' }}>
            <div className="info-item" style={{ gridColumn: 'span 2' }}>
              <span className="info-label">Logradouro / Endereço</span>
              <span className="info-value">
                {data.endereco.logradouro}, {data.endereco.numero} {data.endereco.complemento ? `(${data.endereco.complemento})` : ''}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Bairro</span>
              <span className="info-value">{data.endereco.bairro || 'Não informado'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Município / UF</span>
              <span className="info-value">{data.endereco.municipio} - {data.endereco.uf}</span>
            </div>

            <div className="info-item">
              <span className="info-label">CEP</span>
              <span className="info-value highlight">{data.endereco.cep || 'Não informado'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">E-mail de Contato</span>
              <span className="info-value">{data.contato.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Telefone</span>
              <span className="info-value">{data.contato.telefone}</span>
            </div>
          </div>

          {/* Map Preview */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="info-label">LOCALIZAÇÃO NO MAPA</span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Abrir no Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="map-container">
              <iframe
                title="Mapa de Localização da Empresa"
                className="map-iframe"
                src={mapUrl}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
