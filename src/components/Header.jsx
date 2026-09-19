import React, { useEffect, useState } from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';

import {
  AnimatePresence,
  motion
} from 'framer-motion';

import {
  Menu,
  X,
  ShoppingBag,
  Search
} from 'lucide-react';


export default function Header({ cart }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const count = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <header
        className={`header ${
          scrolled ? 'scrolled' : ''
        }`}
      >
        <Link
          className="wordmark"
          to="/"
        >
          KALANVAY
          <span>TRADITION MEETS ART</span>
        </Link>

        <nav>
          <NavLink to="/shop">
            Collection
          </NavLink>

          <NavLink to="/about">
            The Artist
          </NavLink>

          <NavLink to="/custom-art">
            Commissions
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link
            to="/shop"
            aria-label="Search artworks"
          >
            <Search size={18} />
          </Link>

          <Link
            className="bag"
            to="/cart"
          >
            <ShoppingBag size={18} />

            <i>{count}</i>
          </Link>

          <button
            className="mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </header>


      <AnimatePresence>
        {open && (
          <motion.aside
            className="mobile-nav"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 240
            }}
          >
            <button
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X />
            </button>

            <Link
              onClick={closeMenu}
              to="/shop"
            >
              Collection
            </Link>

            <Link
              onClick={closeMenu}
              to="/about"
            >
              The Artist
            </Link>

            <Link
              onClick={closeMenu}
              to="/custom-art"
            >
              Commissions
            </Link>

            <Link
              onClick={closeMenu}
              to="/cart"
            >
              Bag ({count})
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}