import React, { useState } from 'react';
import { Search, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { formatCNPJ, cleanCNPJ, validateCNPJ, generateRandomCNPJ } from '../utils/cnpjValidator';
import { SAMPLE_CNPJS } from '../services/cnpjApi';

export default function SearchForm({ onSearch, loading, errorMessage }) {
  const [inputVal, setInputVal] = useState('');

  const cleanVal = cleanCNPJ(inputVal);
  const isValid = cleanVal.length === 14 && validateCNPJ(cleanVal);
  const isInvalid = cleanVal.length === 14 && !isValid;

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

  const handleGenerateRandom = () => {
    const randomCnpj = generateRandomCNPJ();
    setInputVal(randomCnpj);
  };

  return (
    <div className="search-hero-card glass-panel animate-fade-in">
      <h2 className="search-title">Consulte qualquer CNPJ instantaneamente</h2>
      <p className="search-subtitle">
        Acesse Razão Social, Quadro de Sócios (QSA), Situação Cadastral, CNAEs, Endereço e exporte o Comprovante Oficial em PDF.
      </p>

      <form onSubmit={handleSubmit} className="search-form-group">
        <div className={`input-with-button ${isValid ? 'is-valid' : ''} ${isInvalid ? 'is-invalid' : ''}`}>
          <Search size={22} className="search-icon" style={{ color: 'var(--text-subtle)', marginRight: '8px' }} />
          
          <input
            type="text"
            className="cnpj-input"
            placeholder="00.000.000/0000-00"
            value={inputVal}
            onChange={handleChange}
            maxLength={18}
            disabled={loading}
            autoFocus
          />

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
            <CheckCircle size={20} color="#22c55e" style={{ margin: '0 8px' }} title="CNPJ com formato válido" />
          )}

          {isInvalid && (
            <AlertCircle size={20} color="#ef4444" style={{ margin: '0 8px' }} title="CNPJ inválido" />
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
            <span>O número de CNPJ digitado é inválido segundo as regras da Receita Federal.</span>
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
          onClick={handleGenerateRandom}
          disabled={loading}
          title="Gerar CNPJ válido aleatório para testes"
          style={{ borderColor: 'var(--brand-primary)' }}
        >
          <Sparkles size={13} color="var(--brand-primary)" />
          <span>Gerar Aleatório</span>
        </button>
      </div>
    </div>
  );
}
