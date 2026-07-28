import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="cnpj-details-card glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ width: '60%' }}>
          <div className="skeleton-box" style={{ height: '28px', width: '80%', marginBottom: '8px' }}></div>
          <div className="skeleton-box" style={{ height: '18px', width: '50%' }}></div>
        </div>
        <div className="skeleton-box" style={{ height: '36px', width: '120px', borderRadius: '99px' }}></div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="skeleton-box" style={{ height: '36px', width: '100px' }}></div>
        <div className="skeleton-box" style={{ height: '36px', width: '100px' }}></div>
        <div className="skeleton-box" style={{ height: '36px', width: '100px' }}></div>
      </div>

      <div className="info-grid">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="info-item" style={{ height: '70px' }}>
            <div className="skeleton-box" style={{ height: '14px', width: '40%', marginBottom: '8px' }}></div>
            <div className="skeleton-box" style={{ height: '20px', width: '70%' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
