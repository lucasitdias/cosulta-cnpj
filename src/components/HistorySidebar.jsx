import React, { useState } from 'react';
import { History, Star, Trash2, ArrowRight, Building } from 'lucide-react';

export default function HistorySidebar({ 
  history, 
  favorites, 
  onSelectCnpj, 
  onClearHistory, 
  onToggleFavorite 
}) {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites'

  const items = activeTab === 'history' ? history : favorites;

  return (
    <aside className="sidebar-panel glass-panel animate-fade-in">
      <div className="sidebar-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeTab === 'history' ? <History size={20} color="var(--brand-primary)" /> : <Star size={20} color="#eab308" />}
          <span>{activeTab === 'history' ? 'Recentes' : 'Favoritos'}</span>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="clear-btn" 
            title="Limpar histórico de buscas"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Trash2 size={14} />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
        <button
          onClick={() => setActiveTab('history')}
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          style={{ flex: 1, padding: '6px', fontSize: '0.8rem', justifyContent: 'center', border: 'none' }}
        >
          <span>Histórico ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          style={{ flex: 1, padding: '6px', fontSize: '0.8rem', justifyContent: 'center', border: 'none' }}
        >
          <span>Favoritos ({favorites.length})</span>
        </button>
      </div>

      {/* List */}
      <div className="history-list">
        {items.length > 0 ? (
          items.map((item) => {
            const isFav = favorites.some(f => f.cnpjRaw === item.cnpjRaw);
            return (
              <div 
                key={item.cnpjRaw} 
                className="history-item"
                onClick={() => onSelectCnpj(item.cnpjRaw)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <Building size={16} style={{ flexShrink: 0, color: 'var(--brand-primary)' }} />
                  <div style={{ overflow: 'hidden' }}>
                    <h5 className="history-company-name">{item.razaoSocial}</h5>
                    <span className="history-cnpj">{item.cnpj}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}
                    style={{ padding: '4px', color: isFav ? '#eab308' : 'var(--text-subtle)' }}
                    title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Star size={15} fill={isFav ? '#eab308' : 'none'} />
                  </button>
                  <ArrowRight size={14} color="var(--text-subtle)" />
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
            {activeTab === 'history' ? (
              <p>Nenhuma consulta realizada ainda. As empresas pesquisadas aparecerão aqui.</p>
            ) : (
              <p>Nenhuma empresa favoritada. Clique na estrela ao lado da empresa para salvar aqui.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
