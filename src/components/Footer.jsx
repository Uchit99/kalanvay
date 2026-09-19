import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">

        <Link className="wordmark" to="/">
          KALANVAY
          <span>TRADITION MEETS ART</span>
        </Link>

        <p>
          Original artworks and editions
          <br />
          by Karishma Shukla, New Delhi, India.
        </p>

        <a
          href="#instagram"
          onClick={(event) => event.preventDefault()}
        >
          <AtSign size={18} />
          Instagram
        </a>

      </div>

      <div className="footer-bottom">

        <span>
          © 2024 Kalanvay · Karishma Shukla
        </span>

        <span>
          Privacy · Terms · Shipping & returns
        </span>

        <span>
          Made with care
        </span>

      </div>
    </footer>
  );
}