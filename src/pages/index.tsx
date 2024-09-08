import React from 'react';
import Layout from '@theme/Layout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fab, fas);

import '../styles/styles-index.css';

export default function Home(): JSX.Element {
  return (
    <Layout>
      <main className="home-page">
        <section className="profile-section">
          <div className="profile-avatar-container">
            <img src="img/photo.png" className="profile-avatar" alt="Aleksey Abramov" />
          </div>
          <div className="profile-info">
            <p>Aleksey Abramov</p>
            <p>System Engineer</p>
          </div>
          <div className="profile-vertical-line"></div>
          <hr className="profile-horizontal-line" />
          <div className="profile-contacts-container">
            <div className="profile-contact-item">
              <a href="mailto:alx@alxcreate.com">
                <FontAwesomeIcon icon={['fas', 'envelope']} /> alx@alxcreate.com
              </a>
            </div>
            <div className="profile-contact-item">
              <a href="https://www.linkedin.com/in/alxcreate" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={['fab', 'linkedin']} /> LinkedIn
              </a>
            </div>
            <div className="profile-contact-item">
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
