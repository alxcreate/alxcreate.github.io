import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fab, fas);

import '../css/styles.css';

export default function Home(): JSX.Element {
  return (
    <Layout>
      <main className="home-page">
        <section className="section">
            <img src="img/photo.png" className="avatar" />
          <div className="contact-info">
            <p>Aleksey Abramov</p>
            <p>System Engineer</p>
          </div>
          <div className="vertical-line"></div>
          <hr className="horizontal-line" />
          <div className="contacts-container">
            <div className="contact-item">
              <a href="mailto:alx@alxcreate.com">
                <FontAwesomeIcon icon={['fas', 'envelope']} /> alx@alxcreate.com
              </a>
            </div>
            <div className="contact-item">
              <a href="https://www.linkedin.com/in/alxcreate" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'linkedin']} /> LinkedIn
              </a>
            </div>
            <div className="contact-item">
              <a href="https://t.me/alxcreate1" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'telegram']} /> Telegram
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
