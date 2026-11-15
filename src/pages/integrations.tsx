import type {ReactNode} from 'react';
import {useState, useMemo} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  getAllIntegrations,
  getAllLabels,
  filterIntegrationsByLabels,
  LABEL_CATEGORIES,
  type IntegrationItem
} from '../hooks/useIntegrations';

function IntegrationCard({title, logo, link, labels, description}: IntegrationItem) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.5rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <a href={link} style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{textAlign: 'center', marginBottom: '1rem'}}>
            <img
              src={logo}
              alt={title}
              style={{
                width: '120px',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <h3 style={{textAlign: 'center', margin: '0 0 0.5rem 0', fontSize: '1.2rem'}}>{title}</h3>
          <p style={{textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0 0 1rem 0'}}>
            {description}
          </p>
        </a>
        <div style={{marginTop: 'auto'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center'}}>
            {labels.map((label, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  color: '#555'
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelFilter({ 
  category, 
  labels, 
  selectedLabels, 
  onToggleLabel 
}: { 
  category: string;
  labels: string[];
  selectedLabels: string[];
  onToggleLabel: (label: string) => void
}) {
  // Only show labels that exist in our integrations
  const availableLabels = labels.filter(label => 
    getAllIntegrations().some(integration => integration.labels.includes(label))
  );
  
  return (
    <div style={{marginBottom: '1.5rem'}}>
      <h4 style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: '#555'}}>{category}</h4>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.3rem'}}>
        {availableLabels.map((label, idx) => {
          const isSelected = selectedLabels.includes(label);
          return (
            <button
              key={idx}
              onClick={() => onToggleLabel(label)}
              style={{
                padding: '0.3rem 0.7rem',
                backgroundColor: isSelected ? '#0070f3' : '#f0f0f0',
                color: isSelected ? 'white' : '#555',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AllLabelsFilter({ 
  allLabels, 
  selectedLabels, 
  onToggleLabel 
}: { 
  allLabels: string[];
  selectedLabels: string[];
  onToggleLabel: (label: string) => void
}) {
  return (
    <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0'}}>
      <h4 style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: '#555'}}>All Labels</h4>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.3rem'}}>
        {allLabels.map((label, idx) => {
          const isSelected = selectedLabels.includes(label);
          return (
            <button
              key={idx}
              onClick={() => onToggleLabel(label)}
              style={{
                padding: '0.3rem 0.7rem',
                backgroundColor: isSelected ? '#0070f3' : '#f0f0f0',
                color: isSelected ? 'white' : '#555',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function IntegrationsPage(): ReactNode {
  const allIntegrations = getAllIntegrations();
  const allLabels = getAllLabels();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  const filteredIntegrations = useMemo(
    () => filterIntegrationsByLabels(allIntegrations, selectedLabels),
    [selectedLabels]
  );
  
  const handleToggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };
  
  const clearFilters = () => {
    setSelectedLabels([]);
  };
  
  return (
    <Layout title="Integrations" description="Browse all Zatobox integrations">
      <div style={{padding: '2rem 0'}}>
        <div className="container">
          <header style={{textAlign: 'center', marginBottom: '3rem'}}>
            <Heading as="h1" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>
              Integrations
            </Heading>
            <p style={{fontSize: '1.1rem', color: '#666', maxWidth: '800px', margin: '0 auto'}}>
              Connect Zatobox to various solar inverters, energy meters, and digital meter ports.
            </p>
          </header>
          
          <div className="row" style={{marginBottom: '2rem'}}>
            <div className="col col--3">
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                height: 'fit-content'
              }}>
                <h3 style={{marginBottom: '1rem', fontSize: '1.1rem'}}>Filter by Label</h3>
                
                {selectedLabels.length > 0 && (
                  <div style={{marginBottom: '1rem'}}>
                    <button
                      onClick={clearFilters}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Clear Filters ({selectedLabels.length})
                    </button>
                  </div>
                )}
                
                {Object.entries(LABEL_CATEGORIES).map(([category, labels]) => (
                  <LabelFilter
                    key={category}
                    category={category}
                    labels={labels}
                    selectedLabels={selectedLabels}
                    onToggleLabel={handleToggleLabel}
                  />
                ))}
                
                <AllLabelsFilter
                  allLabels={allLabels}
                  selectedLabels={selectedLabels}
                  onToggleLabel={handleToggleLabel}
                />
              </div>
            </div>
            
            <div className="col col--9">
              {selectedLabels.length > 0 && (
                <div style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <span style={{color: '#666'}}>
                    Showing {filteredIntegrations.length} of {allIntegrations.length} integrations
                  </span>
                </div>
              )}
              
              {filteredIntegrations.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <p style={{color: '#666', fontSize: '1.1rem'}}>
                    No integrations found matching your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#0070f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="row">
                  {filteredIntegrations.map((integration, idx) => (
                    <IntegrationCard key={idx} {...integration} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
