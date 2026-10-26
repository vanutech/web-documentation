import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ProductItem = {
  title: string;
  logo: string;
  link: string;
};

const zatoboxProductsList: ProductItem[] = [
  {
    title: 'Zatobox One',
    logo: '/img/zatoboxone/zatobox-render.png',
    link: '/docs/product/zatobox-one'
  },
  {
    title: 'Zatobox Plug',
    logo: '/img/zatoboxplug/plug-info.jpg',
    link: '/docs/product/zatobox-plug'
  },
  {
    title: 'Zatobox Energy Adapter',
    logo: '/img/zatoboxone/zatobox-render.png',
    link: '/docs/product/zatobox-energy-adapter'
  },
];

function Product({title, logo, link}: ProductItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md" style={{padding: "1rem"}}>
        <a
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
          <Heading as="h3" style={{marginTop: '0.5rem'}}>
            {title}
          </Heading>
        </a>
      </div>
    </div>
  );
}

function ProductSection({title, items}: {title: string; items: ProductItem[]}) {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {title}
        </h2>
        {items.length > 0 && (
          <div className="row">
            {items.map((props, idx) => (
              <Product key={idx} {...props} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ZatoboxProducts(): ReactNode {
  return (
    <ProductSection title="Zatobox Products" items={zatoboxProductsList} />
  );
}
