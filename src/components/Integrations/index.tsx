import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { $Command } from '@aws-sdk/client-iot';

type IntegrationItem = {
  title: string;
  logo: string;
  link: string;
};

const Integrationslist: IntegrationItem[] = [
  {
    title: 'Huawei SUN2000',
    logo: '/img/logos/huawei.png',
    link: '/docs/integrations/huawei'
  },
  {
    title: 'Goodwe',
    logo: '/img/logos/goodwe.png',
    link: '/docs/integrations/goodwe'
  },
  {
    title: 'Solis',
    logo: '/img/logos/solis.png',
    link: '/docs/integrations/solis'
  },
  {
    title: 'Growatt SPH',
    logo: '/img/logos/growatt.png',
    link: '/docs/integrations/growattSPH'
  },
  {
    title: 'P1 Port',
    logo: '/img/logos/p1-port.svg',
    link: '/docs/integrations/p1-port'
  },
  {
    title: 'S1 Port',
    logo: '/img/logos/s1-port.svg',
    link: '/docs/integrations/s1-port'
  },
];

function Integration({title, logo, link}: IntegrationItem) {
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
          alt={logo}
          style={{
            width: '150px',
            height: 'auto',
            marginBottom: '0.5rem',
            objectFit: 'contain',
          }}
        />
    </a>
</div>
</div>
  );
}

export default function Integrations(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {Integrationslist.map((props, idx) => (
            <Integration key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
