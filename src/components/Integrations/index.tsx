import type {ReactNode} from 'react';
import {useState, useMemo} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import {
  getAllIntegrations,
  getAllLabels,
  filterIntegrationsByLabels,
  type IntegrationItem
} from '../../hooks/useIntegrations';

function Integration({title, logo, link, labels}: IntegrationItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{padding: "1rem"}}>
        <a
          key={title}
          href={link}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            width: '300px',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '1rem',
            transition: 'transform 0.2s, background-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = '#f5f5f5ff';
            el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            el.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = 'white';
            el.style.boxShadow = 'none';
            el.style.transform = 'translateY(0)';
          }}
        >
          <img
            src={logo}
            alt={title}
            style={{
              width: '150px',
              height: 'auto',
              marginBottom: '0.5rem',
              objectFit: 'contain',
            }}
          />
          <h3 style={{margin: '0.5rem 0', fontSize: '1.1rem'}}>{title}</h3>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3rem', marginTop: '0.5rem'}}>
            {labels.map((label, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  color: '#555'
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </a>
      </div>
    </div>
  );
}

function FilterControls({ 
  allLabels, 
  selectedLabels, 
  onToggleLabel 
}: { 
  allLabels: string[]; 
  selectedLabels: string[]; 
  onToggleLabel: (label: string) => void 
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: '0.5rem', 
      marginBottom: '2rem' 
    }}>
      <button
        onClick={() => onToggleLabel('')}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: selectedLabels.length === 0 ? '#0070f3' : '#e0e0e0',
          color: selectedLabels.length === 0 ? 'white' : '#555',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        All
      </button>
      {allLabels.map((label, idx) => {
        const isSelected = selectedLabels.includes(label);
        return (
          <button
            key={idx}
            onClick={() => onToggleLabel(label)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isSelected ? '#0070f3' : '#e0e0e0',
              color: isSelected ? 'white' : '#555',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}


export default function Integrations(): ReactNode {
  const allIntegrations = getAllIntegrations();
  const allLabels = getAllLabels();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  const filteredIntegrations = useMemo(
    () => filterIntegrationsByLabels(allIntegrations, selectedLabels),
    [selectedLabels]
  );
  
  const handleToggleLabel = (label: string) => {
    if (label === '') {
      setSelectedLabels([]);
    } else if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };
  
  return (
    <section className={styles.features}>
      <div className="container">
        <FilterControls
          allLabels={allLabels}
          selectedLabels={selectedLabels}
          onToggleLabel={handleToggleLabel}
        />
        {filteredIntegrations.length === 0 ? (
          <p style={{textAlign: 'center', color: '#666'}}>
            No integrations found with the selected filters.
          </p>
        ) : (
          <div className="row">
            {filteredIntegrations.map((props, idx) => (
              <Integration key={idx} {...props} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
