import React from 'react';
import { Building2, Sun, Moon, CheckCircle2 } from 'lucide-react';

export default function Header({ theme, toggleTheme, apiProvider }) {
  return (
    <header className="app-header glass-panel animate-fade-in">
      <div className="brand-title">
        <div className="brand-icon-wrapper">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="brand-text-h1">Consulta CNPJ Pro</h1>
          <p className="brand-tagline">Dados Cadastrais da Receita Federal em Tempo Real</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="api-status-badge">
          <span className="api-status-dot"></span>
          <span>API Online ({apiProvider || 'BrasilAPI'})</span>
        </div>

        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
        </button>
      </div>
    </header>
  );
}
