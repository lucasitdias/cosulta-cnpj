import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import CnpjDetails from './components/CnpjDetails';
import HistorySidebar from './components/HistorySidebar';
import SkeletonLoader from './components/SkeletonLoader';
import { fetchCNPJ } from './services/cnpjApi';
import './App.css';

export default function App() {
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cnpj_theme') || 'dark';
  });

  // Data states
  const [cnpjData, setCnpjData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Storage states
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('cnpj_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cnpj_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cnpj_theme', theme);
  }, [theme]);

  // Sync history and favorites to localStorage
  useEffect(() => {
    localStorage.setItem('cnpj_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('cnpj_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Initial load: Fetch Petrobras as a default demonstration
  useEffect(() => {
    handleSearch('33000167000101', false);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async (cnpjString, addToHistory = true) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await fetchCNPJ(cnpjString);
      setCnpjData(result);

      if (addToHistory) {
        setHistory(prev => {
          // Remove duplicate if already exists
          const filtered = prev.filter(item => item.cnpjRaw !== result.cnpjRaw);
          return [result, ...filtered].slice(0, 20); // Keep last 20
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar consulta.');
      setCnpjData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.cnpjRaw === item.cnpjRaw);
      if (exists) {
        return prev.filter(f => f.cnpjRaw !== item.cnpjRaw);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const isCurrentFavorite = cnpjData && favorites.some(f => f.cnpjRaw === cnpjData.cnpjRaw);

  return (
    <div className="app-container">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        apiProvider={cnpjData?.meta?.provider} 
      />

      <SearchForm 
        onSearch={(cnpj) => handleSearch(cnpj, true)}
        loading={loading}
        errorMessage={errorMessage}
      />

      <main className={`main-grid ${history.length > 0 || favorites.length > 0 ? 'has-sidebar' : ''}`}>
        <section className="main-content">
          {loading ? (
            <SkeletonLoader />
          ) : (
            cnpjData && (
              <CnpjDetails 
                data={cnpjData}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            )
          )}
        </section>

        {(history.length > 0 || favorites.length > 0) && (
          <HistorySidebar 
            history={history}
            favorites={favorites}
            onSelectCnpj={(cnpj) => handleSearch(cnpj, true)}
            onClearHistory={handleClearHistory}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Consulta CNPJ Pro • Dados abertos da Receita Federal do Brasil via BrasilAPI & Minha Receita.</p>
        <p style={{ marginTop: '4px', color: 'var(--text-subtle)' }}>
          Desenvolvido com React & Glassmorphism Design System.
        </p>
      </footer>
    </div>
  );
}
