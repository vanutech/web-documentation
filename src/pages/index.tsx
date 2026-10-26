import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import Integrations from '@site/src/components/Integrations';
import ZatoboxProducts from '@site/src/components/ZatoboxProducts';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
      </div>
    </header>
  );
}


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();  

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
   

        <section className="container" style={{padding: '2rem 0', textAlign: 'center'}}>
          <h2>Documentation</h2>
          <p style={{fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 2rem'}}>
            Zato energy control is your easy to use system. It can connect to all solar inverters locally and can control devices based on import/export.
          </p>
        
          
          <h3 style={{marginTop: '2rem'}}>APP</h3>
          <p style={{fontSize: '1rem', maxWidth: '800px', margin: '0 auto 2rem'}}>
            The app can be downloaded through the app store and play store. Search zatobox in the respective stores.
            <br/>
            Instructions for the app can be found here: <Link to="/docs/app-setup/appindex">App setup</Link>
          </p>
        </section>

        <ZatoboxProducts />

        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Integrations
        </h2>
        
        <Integrations />

      </main>
    </Layout>
  );
}
