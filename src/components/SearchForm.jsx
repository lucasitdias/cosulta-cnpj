import React, { useState } from 'react';
import { Search, X, CheckCircle, AlertCircle, Sparkles, Binary } from 'lucide-react';
import { 
  formatCNPJ, cleanCNPJ, validateCNPJ, generateRandomCNPJ, 
  generateRandomAlphanumericCNPJ, isAlphanumericCNPJ 
} from '../utils/cnpjValidator';
import { SAMPLE_CNPJS } from '../services/cnpjApi';

export default function SearchForm({ onSearch, loading, errorMessage }) {
  const [inputVal, setInputVal] = useState('');

  const cleanVal = cleanCNPJ(inputVal);
  const isValid = cleanVal.length === 14 && validateCNPJ(cleanVal);
  const isInvalid = cleanVal.length === 14 && !isValid;
  const isAlpha = isAlphanumericCNPJ(cleanVal);

  const handleChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setInputVal(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cleanVal.length !== 14) return;
    onSearch(cleanVal);
  };

  const handleSelectSample = (sampleCnpj) => {
    setInputVal(sampleCnpj);
    onSearch(cleanCNPJ(sampleCnpj));
  };

  const handleGenerateNumeric = () => {
    const randomCnpj = generateRandomCNPJ();
    setInputVal(randomCnpj);
  };

  const handleGenerateAlphanumeric = () => {
    const randomAlphaCnpj = generateRandomAlphanumericCNPJ();
    setInputVal(randomAlphaCnpj);
  };

  return (
    <div className="search-hero-card glass-panel animate-fade-in">
      <h2 className="search-title">Consulte qualquer CNPJ (Numérico ou Alfanumérico)</h2>
      <p className="search-subtitle">
        Suporte completo ao <strong>Novo Modelo de CNPJ Alfanumérico (RFB IN 2.229)</strong> e ao modelo tradicional.
        Acesse Razão Social, QSA, CNAEs, Endereço e exporte em PDF.
      </p>

      <form onSubmit={handleSubmit} className="search-form-group">
        <div className={`input-with-button ${isValid ? 'is-valid' : ''} ${isInvalid ? 'is-invalid' : ''}`}>
          <Search size={22} className="search-icon" style={{ color: 'var(--text-subtle)', marginRight: '8px' }} />
          
          <input
            type="text"
            className="cnpj-input"
            placeholder="12.ABC.345/A001-90 ou 00.000.000/0000-00"
            value={inputVal}
            onChange={handleChange}
            maxLength={18}
            disabled={loading}
            autoFocus
          />

          {isAlpha && isValid && (
            <span style={{ 
              fontSize: '0.675rem', 
              fontWeight: 800, 
              background: 'rgba(139, 92, 246, 0.2)', 
              color: '#8b5cf6', 
              padding: '2px 6px', 
              borderRadius: '4px',
              marginRight: '6px'
            }}>
              ALFANUMÉRICO
            </span>
          )}

          {inputVal && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setInputVal('')}
              title="Limpar campo"
            >
              <X size={18} />
            </button>
          )}

          {isValid && (
            <CheckCircle size={20} color="#22c55e" style={{ margin: '0 8px' }} title="CNPJ válido perante o algoritmo da Receita Federal" />
          )}

          {isInvalid && (
            <AlertCircle size={20} color="#ef4444" style={{ margin: '0 8px' }} title="CNPJ com formato ou dígitos verificadores inválidos" />
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || cleanVal.length !== 14}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Consultar</span>
              </>
            )}
          </button>
        </div>

        {isInvalid && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>O número ou letras do CNPJ digitado são inválidos conforme o algoritmo Modulo 11 da Receita Federal.</span>
          </div>
        )}

        {errorMessage && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Quick Example Chips */}
      <div className="samples-container">
        <span className="samples-label">Exemplos para testar:</span>
        {SAMPLE_CNPJS.map((sample) => (
          <button
            key={sample.cnpj}
            type="button"
            className="sample-chip"
            onClick={() => handleSelectSample(sample.cnpj)}
            disabled={loading}
          >
            <span>{sample.name}</span>
            <span className="sample-badge">{sample.badge}</span>
          </button>
        ))}
        
        <button
          type="button"
          className="sample-chip"
          onClick={handleGenerateAlphanumeric}
          disabled={loading}
          title="Gerar CNPJ Alfanumérico Válido (Novo Modelo 2026)"
          style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
        >
          <Sparkles size={13} color="#8b5cf6" />
          <span>Gerar Alfanumérico</span>
        </button>

        <button
          type="button"
          className="sample-chip"
          onClick={handleGenerateNumeric}
          disabled={loading}
          title="Gerar CNPJ Numérico Tradicional"
          style={{ borderColor: 'var(--brand-primary)' }}
        >
          <Binary size={13} color="var(--brand-primary)" />
          <span>Gerar Numérico</span>
        </button>
      </div>
    </div>
  );
}
