import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Navigate,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  ShoppingBag,
  Search,
  Heart,
  Plus,
  Minus,
  Trash2,
  Check,
  AtSign,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

import "./styles.css";
import "./responsive.css";
import "./features.css";
import "./aesthetic.css";
import "./gallery.css";
import "./hero.css";
import { addWishlistItem, createCommission, formatArtwork, getArtwork, getArtworks, getFeaturedArtworks, getWishlist, removeWishlistItem } from "./lib/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import image0005 from "../images/product image/IMG-20260918-WA0005.jpg.jpeg";
import image0006 from "../images/product image/IMG-20260918-WA0006.jpg.jpeg";
import image0007 from "../images/product image/IMG-20260918-WA0007.jpg.jpeg";
import image0008 from "../images/product image/IMG-20260918-WA0008.jpg.jpeg";
import image0011 from "../images/product image/IMG-20260918-WA0011.jpg.jpeg";
import image0012 from "../images/product image/IMG-20260918-WA0012.jpg.jpeg";
import image0013 from "../images/product image/IMG-20260918-WA0013.jpg.jpeg";
import image0014 from "../images/product image/IMG-20260918-WA0014.jpg.jpeg";
import image0015 from "../images/product image/IMG-20260918-WA0015.jpg.jpeg";
import image0019 from "../images/product image/IMG-20260918-WA0019.jpg.jpeg";
import image0021 from "../images/product image/IMG-20260918-WA0021.jpg.jpeg";
import image0022 from "../images/product image/IMG-20260918-WA0022.jpg.jpeg";
import image0023 from "../images/product image/IMG-20260918-WA0023.jpg.jpeg";
import image0025 from "../images/product image/IMG-20260918-WA0025.jpg.jpeg";
import image0026 from "../images/product image/IMG-20260918-WA0026.jpg.jpeg";
import image0028 from "../images/product image/IMG-20260918-WA0028.jpg.jpeg";
import image0029 from "../images/product image/IMG-20260918-WA0029.jpg.jpeg";
import image0059 from "../images/product image/IMG-20260918-WA0059.jpg.jpeg";
import image0060 from "../images/product image/IMG-20260918-WA0060.jpg.jpeg";
import image0061 from "../images/product image/IMG-20260918-WA0061.jpg.jpeg";
import kalanvayLogo from "../images/logo/WhatsApp Image 2026-09-19 at 12.50.52 AM.jpeg";

/* =========================================================
   FALLBACK ARTWORK DATA
   ========================================================= */

const art = [
  {
    id: 1,
    title: "Borrowed Light",
    medium: "Oil on linen",
    size: "91 × 122 cm",
    price: 245000,
    type: "Original",
    image: image0005,
    images: [
      image0005, image0006, image0007,
    ],
    description:
      "A quiet study in liminal colour, where the residue of daylight settles into imagined interiors.",
  },
  {
    id: 2,
    title: "At the Edge of Blue",
    medium: "Acrylic & pigment",
    size: "76 × 102 cm",
    price: 185000,
    type: "Original",
    image: image0008,
    images: [
      image0008, image0011, image0012,
    ],
    description:
      "A textured meditation on openness, distance and the geometry of memory.",
  },
  {
    id: 3,
    title: "Small Hours",
    medium: "Giclée print",
    size: "45 × 60 cm",
    price: 18000,
    type: "Limited edition",
    image: image0013,
    images: [
      image0013, image0014, image0015,
    ],
    description:
      "An archival print from the artist’s nocturne series, signed and numbered.",
  },
  {
    id: 4,
    title: "Vernal Field",
    medium: "Oil & cold wax",
    size: "80 × 80 cm",
    price: 165000,
    type: "Original",
    image: image0019,
    images: [
      image0019, image0021, image0022,
    ],
    description:
      "Dense layers of oil colour uncover an expansive, half-remembered landscape.",
  },
  {
    id: 5,
    title: "After the Rain",
    medium: "Giclée print",
    size: "50 × 70 cm",
    price: 22000,
    type: "Limited edition",
    image: image0023,
    images: [
      image0023, image0025, image0026,
    ],
    description:
      "A considered edition in museum-grade pigment ink on cotton rag paper.",
  },
  {
    id: 6,
    title: "The Long Way Home",
    medium: "Oil on canvas",
    size: "122 × 91 cm",
    price: 270000,
    type: "Original",
    image: image0028,
    images: [
      image0028, image0029, image0059,
    ],
    description:
      "A rhythmic architectural composition from the Places We Carry series.",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const Fade = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

/* =========================================================
   HEADER
   ========================================================= */

function Header({ cart, wishlistCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const count = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <Link className="wordmark" to="/">
          <img className="brand-logo" src={kalanvayLogo} alt="Kalanvay" />
          <strong className="brand-name">KALANVAY</strong>
          <span>CONTEMPORARY ART STUDIO</span>
        </Link>

        <nav>
          <NavLink to="/shop">Collection</NavLink>
          <NavLink to="/custom-art">Custom Art</NavLink>
        </nav>

        <div className="header-actions">
          <Link className="header-action" to="/shop" aria-label="Search artworks">
            <Search size={18} />
            <span>Search</span>
          </Link>

          <Link className="header-action wishlist-link" to="/account" aria-label={`View wishlist (${wishlistCount})`}>
            <Heart size={18} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <i>{wishlistCount}</i>}
          </Link>

          <Link className="bag header-action" to="/cart" aria-label="View cart">
            <ShoppingBag size={18} />
            <i>{count}</i>
            <span>Cart</span>
          </Link>

          <Link className="header-account" to="/account">Account</Link>

          <button
            type="button"
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 240,
            }}
          >
            <button type="button" onClick={() => setOpen(false)}>
              <X />
            </button>

            <Link onClick={() => setOpen(false)} to="/shop">
              Collection
            </Link>

            <Link onClick={() => setOpen(false)} to="/custom-art">
              Custom Art
            </Link>

            <Link onClick={() => setOpen(false)} to="/account">
              Wishlist & Account
            </Link>

            <Link onClick={() => setOpen(false)} to="/cart">
              Bag ({count})
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   ARTWORK CARD
   ========================================================= */

function ArtworkCard({ item, add, isWishlisted = false, onWishlist, wishlistBusy = false }) {
  const artworkPath = `/artwork/${item.slug || item.id}`;
  return (
    <article className="art-card">
      <div className="art-image">
        <Link to={artworkPath}>
          <img src={item.image} alt={item.title} />
        </Link>

        <Link to={artworkPath} className="view-art">
          View artwork <ArrowUpRight size={16} />
        </Link>

        <button
          type="button"
          className={`heart ${isWishlisted ? "active" : ""}`}
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${item.title} ${isWishlisted ? "from" : "to"} wishlist`}
          aria-pressed={isWishlisted}
          disabled={wishlistBusy}
          onClick={() => onWishlist?.(item)}
        >
          <Heart size={17} />
        </button>
      </div>

      <div className="art-meta">
        <div>
          <Link to={artworkPath}>
            <h3>{item.title}</h3>
          </Link>

          <p>
            {item.medium} · {item.size}
          </p>
        </div>

        <div className="price">
          {money(item.price)}
          <small>{item.type}</small>
        </div>
      </div>

      <button
        type="button"
        className="quick-add"
        onClick={() => add(item)}
      >
        <Plus size={16} />
        Add to bag
      </button>
    </article>
  );
}

/* =========================================================
   HOME
   ========================================================= */

const specialties = [
  { title: "Traditional Art", slug: "traditional-art", description: "Rooted in India’s rich artistic heritage.", items: ["Madhubani Art", "Mandala Art", "Pichwai Art", "Warli Art", "Kalamkari Art", "Gond Art", "Kalighat Painting"] },
  { title: "Modern Art", slug: "modern-art", description: "Contemporary designs for expressive spaces.", items: ["Boho Art", "Creative Patterns", "Artistic Figurines"] },
  { title: "3D & Textured Art", slug: "3d-textured-art", description: "Depth, texture and handcrafted character.", items: ["Lippan Art", "Textured Art"] },
  { title: "Wall Art", slug: "wall-art", description: "Made to find its place on your wall.", items: ["Paper Art — Framed or Unframed", "Canvas Art — Framed or Unframed"] },
  { title: "Decorative Mini Canvases", slug: "decorative-mini-canvases", description: "Small canvases for shelves, corners and personal spaces.", items: [] },
];

function Home({ add, wishlistProps }) {
  const [featured, setFeatured] = useState(art.slice(0, 4));
  useEffect(() => {
    getFeaturedArtworks().then((items) => {
      if (items.length) setFeatured(items.map(formatArtwork));
    }).catch(() => undefined);
  }, []);

  return (
    <main>
      <section className="hero">
        <motion.div className="hero-art" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}>
          <img src={featured[0]?.image || art[0].image} alt="Featured Kalanvay artwork" />
          <p>Selected work — Kalanvay studio</p>
        </motion.div>

        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            KALANVAY · TRADITIONAL INDIAN ART / CONTEMPORARY EXPRESSION
          </motion.p>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Art that belongs
            <br />
            in your <em>space.</em>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Original artworks and thoughtful editions, made to bring a little more feeling into the everyday.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link className="button dark" to="/shop">
              Explore the collection
              <ArrowRight size={17} />
            </Link>

            <Link className="hero-secondary" to="/custom-art">
              Create custom art <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="hero-scroll">
          Scroll to wander <span />
        </div>
      </section>

      <section className="intro section featured-heading">
        <Fade>
          <p className="eyebrow">01 — Featured works</p>

          <h2>
            A considered selection,
            <br />
            made to be lived with <em>forever.</em>
          </h2>
        </Fade>

        <Fade className="intro-aside">
          <p>
            Works chosen for their quiet presence, lasting materials and capacity to transform an everyday room.
          </p>

          <Link className="text-link" to="/shop">
            View collection <ArrowRight size={16} />
          </Link>
        </Fade>
      </section>

      <section className="collection section">
        {featured.slice(0, 4).map((item, index) => (
          <Fade
            key={item.id}
            className={`grid-item item-${index}`}
          >
            <ArtworkCard item={item} add={add} {...wishlistProps(item)} />
          </Fade>
        ))}
      </section>

      <section className="artist-banner">
        <div>
          <p className="eyebrow">Kalanvay studio</p>

          <h2>
            Made with art.
            <br />
            <em>Created with heart.</em>
          </h2>

          <Link className="button light" to="/custom-art">
            Create something personal
            <ArrowRight size={17} />
          </Link>
        </div>

        <img
          src={image0060}
          alt="Kalanvay artwork in the studio"
        />
      </section>

      <section className="specialties section">
        <Fade>
          <p className="eyebrow">02 — Our art specialities</p>
          <h2>Every tradition has a <em>new expression.</em></h2>
        </Fade>
        <div className="specialty-grid">
          {specialties.map((category, index) => (
            <Link className="specialty-card" key={category.slug} to={`/shop?category=${category.slug}`}>
              <span>0{index + 1}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              {category.items.length > 0 && <ul>{category.items.map((item) => <li key={item}>{item}</li>)}</ul>}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="selected-works section">
        <div><p className="eyebrow">03 — The collection</p><h2>Find a work that feels like <em>home.</em></h2></div>
        <Link className="button gold" to="/shop">Explore all works <ArrowRight size={17} /></Link>
      </section>

      <section className="why-section section">
        <Fade><p className="eyebrow">Why Kalanvay</p><h2>Art with a sense of <em>place.</em></h2></Fade>
        <div className="why-grid">
          {[['Thoughtfully Made', 'Each artwork is created with attention to detail and material.'], ['Made for Your Space', 'Art designed to become part of your environment.'], ['Personal & Meaningful', 'Custom pieces can be created around your story.'], ['Authentic Craft', 'Contemporary expression rooted in Indian artistic traditions.']].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="commission section">
        <Fade>
          <p className="eyebrow">Made for you</p>

          <h2>
            Have something
            <br />
            personal in <em>mind?</em>
          </h2>
        </Fade>

        <Fade>
          <p>
            A commissioned piece is a conversation, a meeting of
            your story and Karishma’s practice. Let’s create something
            that is wholly yours.
          </p>

          <Link className="text-link" to="/custom-art">
            Request custom artwork
            <ArrowUpRight size={16} />
          </Link>
        </Fade>
      </section>

      <Newsletter />
    </main>
  );
}

/* =========================================================
   SHOP
   ========================================================= */

function Shop({ add, wishlistProps }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();

  const [artworks, setArtworks] = useState(art);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadArtworks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getArtworks();

        if (!mounted) return;

        const formatted = data.map(formatArtwork);

        setArtworks(formatted.length > 0 ? formatted : art);
      } catch (err) {
        console.error(
          "Failed to load artworks:",
          err
        );

        if (!mounted) return;

        setError(
          "Unable to reach the live collection. Showing the studio catalogue."
        );

        // Keep existing hardcoded artworks as fallback.
        setArtworks(art);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadArtworks();

    return () => {
      mounted = false;
    };
  }, []);

  const category = searchParams.get("category") || "";
  useEffect(() => { setFilter(category || "All"); }, [category]);
  const chooseFilter = (value) => {
    setFilter(value);
    setSearchParams(value === "All" || value === "Original" || value === "Limited edition" ? {} : { category: value });
  };

  const results = artworks.filter((item) => {
    const matchesFilter =
      filter === "All" || item.type === filter ||
      String(item.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === filter;

    const search =
      query.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.title
        .toLowerCase()
        .includes(search) ||
      item.medium
        .toLowerCase()
        .includes(search) ||
      String(item.category || "").toLowerCase().includes(search) ||
      String(item.type || "").toLowerCase().includes(search);

    return (
      matchesFilter &&
      matchesSearch
    );
  });

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">
          Available works
        </p>

        <h1>The Collection</h1>

        <p>
          Original works and limited editions,
          each made with enduring materials
          and attention.
        </p>
      </div>

      <div className="shop-tools">
        <div className="search-box">
          <Search size={17} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search artworks"
          />
        </div>

        <div className="filter-set">
          {[
            "All",
            "traditional-art",
            "modern-art",
            "3d-textured-art",
            "wall-art",
            "decorative-mini-canvases",
            "Original",
            "Limited edition",
          ].map((option) => (
            <button
              type="button"
              className={
                filter === option
                  ? "active"
                  : ""
              }
              onClick={() => chooseFilter(option)}
              key={option}
            >
              {option.replaceAll("-", " ")}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="sort"
        >
          Featured
          <ChevronDown size={15} />
        </button>
      </div>

      {loading && (
        <div className="collection-loading">
          <p>Loading the collection…</p>
        </div>
      )}

      {error && !loading && (
        <div className="collection-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && (
        <section className="shop-grid">
          {results.length > 0 ? (
            results.map((item) => (
              <ArtworkCard
                item={item}
                add={add}
                {...wishlistProps(item)}
                key={item.id}
              />
            ))
          ) : (
            <div className="empty">
              <Search size={32} />

              <h2>
                No artworks found.
              </h2>

              <p>
                Try another search or filter.
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

/* =========================================================
   PRODUCT
   ========================================================= */

function Product({ add, wishlistProps }) {
  const location = useLocation();

  const artworkId =
  location.pathname.split("/").pop();

  const fallback =
  art.find(
    (artwork) =>
      String(artwork.id) ===
      String(artworkId)
  ) || art[0];
  const [item, setItem] = useState(fallback);
  useEffect(() => {
    getArtwork(artworkId).then((data) => setItem(formatArtwork(data))).catch(() => setItem(fallback));
  }, [artworkId]);

  const gallery = (item.images?.length
    ? item.images.map((image) =>
        typeof image === "string" ? image : image.url
      )
    : [item.image]
  ).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(gallery[0]);

  useEffect(() => {
    setSelectedImage(gallery[0]);
  }, [item.id]);

  return (
    <main className="product-page">
      <div className="product-gallery">
        <motion.div
          className="product-main-image"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <img src={selectedImage} alt={item.title} />
        </motion.div>

        {gallery.length > 1 && (
          <div className="product-thumbnails" aria-label="Artwork image gallery">
            {gallery.map((image, index) => (
              <button
                type="button"
                key={image}
                className={selectedImage === image ? "active" : ""}
                onClick={() => setSelectedImage(image)}
                aria-label={`Show image ${index + 1} of ${item.title}`}
                aria-pressed={selectedImage === image}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <p className="eyebrow">
          {item.type} · 2024
        </p>

        <h1>{item.title}</h1>

        <p className="product-price">
          {money(item.price)}
        </p>

        <p className="product-desc">
          {item.description}
        </p>

        <dl>
          <div>
            <dt>Medium</dt>
            <dd>{item.medium}</dd>
          </div>

          <div>
            <dt>Size</dt>
            <dd>{item.size}</dd>
          </div>

          <div>
            <dt>Edition</dt>
            <dd>
              {item.type === "Original"
                ? "One of one"
                : "Edition of 30"}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => add(item)}
          className="button dark full"
        >
          Add to bag
          <ShoppingBag size={17} />
        </button>

        <button
          type="button"
          onClick={() => wishlistProps(item).onWishlist(item)}
          className={`wishlist-product ${wishlistProps(item).isWishlisted ? "active" : ""}`}
          disabled={wishlistProps(item).wishlistBusy}
        >
          <Heart size={17} />
          {wishlistProps(item).isWishlisted ? "Saved to wishlist" : "Add to wishlist"}
        </button>

        <p className="shipping-note">
          <Check size={15} />
          Complimentary insured shipping within India
        </p>

        <details>
          <summary>
            Shipping & delivery
            <Plus size={16} />
          </summary>

          <p>
            Original works are packed and dispatched with great
            care. Delivery timing is confirmed after purchase.
          </p>
        </details>

        <details>
          <summary>
            Authenticity
            <Plus size={16} />
          </summary>

          <p>
            Each original includes a signed certificate of
            authenticity.
          </p>
        </details>
      </div>

      <section className="related">
        <p className="eyebrow">Continue exploring</p>

        <h2>You may also like</h2>

        <div className="related-grid">
          {art
            .filter((artwork) => artwork.id !== item.id)
            .slice(0, 3)
            .map((artwork) => (
              <ArtworkCard
                item={artwork}
                add={add}
                {...wishlistProps(artwork)}
                key={artwork.id}
              />
            ))}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   CART
   ========================================================= */

function Cart({ cart, setCart }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const update = (id, delta) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(1, item.qty + delta),
            }
          : item
      )
    );
  };

  const remove = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <main className="cart-page page">
      <p className="eyebrow">Your selection</p>

      <h1>
        Shopping bag <sup>{count}</sup>
      </h1>

      {cart.length === 0 ? (
        <div className="empty">
          <ShoppingBag />

          <h2>Your bag is waiting.</h2>

          <Link className="button dark" to="/shop">
            Explore works
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section>
            {cart.map((item) => (
              <article
                className="cart-line"
                key={item.id}
              >
                <img src={item.image} alt="" />

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.medium}</p>

                  <button
                    type="button"
                    className="remove"
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className="quantity">
                  <button
                    type="button"
                    onClick={() =>
                      update(item.id, -1)
                    }
                  >
                    <Minus size={14} />
                  </button>

                  {item.qty}

                  <button
                    type="button"
                    onClick={() =>
                      update(item.id, 1)
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <strong>
                  {money(item.price * item.qty)}
                </strong>
              </article>
            ))}
          </section>

          <aside className="summary">
            <h2>Order summary</h2>

            <div>
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>

            <div>
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>

            <div className="total">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="button dark full"
            >
              Secure checkout
              <ArrowRight size={16} />
            </Link>

            <p>Taxes calculated at checkout.</p>
          </aside>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   COMMISSION
   ========================================================= */

function Commission() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => { setRegister(initialMode === "register"); setError(""); }, [initialMode]);
  const submit = async (event) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setStatus("loading"); setError("");
    try {
      await createCommission(Object.fromEntries(fields.entries()));
      setStatus("success");
    } catch (submitError) {
      setError(submitError.message || "We could not send your request. Please try again.");
      setStatus("error");
    }
  };

  return (
    <main>
      <section className="commission-hero">
        <p className="eyebrow">Private commissions</p>

        <h1>
          Your idea.
          <br />
          Your story.
          <br />
          <em>Your artwork.</em>
        </h1>

        <p>
          A personal work begins with a shared conversation.
        </p>
      </section>

      <section className="process section">
        <p className="eyebrow">How it works</p>

        {[
          [
            "01",
            "Share your idea",
            "Tell us the story, setting, colours or feeling you want to hold onto.",
          ],
          [
            "02",
            "Shape the direction",
            "We’ll discuss scale, medium, timeline and provide a detailed quotation.",
          ],
          [
            "03",
            "Make it yours",
            "Karishma brings your work to life, sharing progress along the way.",
          ],
        ].map((step) => (
          <article key={step[0]}>
            <span>{step[0]}</span>
            <h3>{step[1]}</h3>
            <p>{step[2]}</p>
          </article>
        ))}
      </section>

      <section className="commission-form section">
        <div>
          <p className="eyebrow">
            Start a conversation
          </p>

          <h2>
            Tell us what you’re imagining.
          </h2>

          <p>
            We typically respond within 2–3 working days. For
            time-sensitive requests, please let us know your
            deadline.
          </p>
        </div>

        {status === "success" ? (
          <div className="thanks">
            <Check size={34} />

            <h3>Thank you for sharing.</h3>

            <p>
              Your commission note is on its way to the studio.
              We’ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
          >
            <label>
              Your name
              <input
                required
                name="name"
                placeholder="Name"
              />
            </label>

            <label>
              Email address
              <input
                required
                name="email"
                type="email"
                placeholder="hello@example.com"
              />
            </label>

            <label>
              Phone number
              <input name="phone" type="tel" placeholder="+91 00000 00000" />
            </label>

            <div className="form-pair">
              <label>
                Artwork type

                <select name="artworkType">
                  <option>
                    Original painting
                  </option>

                  <option>Portrait</option>

                  <option>
                    Limited edition
                  </option>
                </select>
              </label>

              <label>
                Budget range

                <select name="budget">
                  <option>
                    ₹50,000–₹1,00,000
                  </option>

                  <option>
                    ₹1,00,000–₹2,50,000
                  </option>

                  <option>₹2,50,000+</option>
                </select>
              </label>
            </div>

            <label>
              Preferred dimensions
              <input name="dimensions" placeholder="e.g. 60 × 90 cm" />
            </label>

            <label>
              What would you like us to create?

              <textarea name="description"
                required
                placeholder="Share the story, colours, place or feeling behind your idea..."
              />
            </label>

            <label className="file-input">
              Reference images (optional)

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
              />
            </label>

            <button
              className="button dark"
              type="submit"
            >
              {status === "loading" ? "Sending request…" : "Send commission request →"}
              <ArrowRight size={16} />
            </button>
            {status === "error" && <p className="form-error" role="alert">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   ABOUT
   ========================================================= */

function About() {
  return (
    <main className="about">
      <section className="about-hero">
        <div>
          <p className="eyebrow">The artist</p>

          <h1>
            Karishma
            <br />
            <em>Shukla</em>
          </h1>

          <p>
            Painter, observer and collector of soft edges.
          </p>
        </div>

        <img
          src={image0061}
          alt="Kalanvay original artwork"
        />
      </section>

      <section className="about-copy section">
        <p className="eyebrow">
          A practice of attention
        </p>

        <h2>
          “I paint the parts of a place that stay with you
          after you’ve left.”
        </h2>

        <div>
          <p>
            Karishma Shukla is an interdisciplinary artist based
            in New Delhi. Her paintings use accumulated colour,
            shifting edges and deliberate mark-making to explore
            the places we carry within us.
          </p>

          <p>
            Her work has found homes across India and abroad,
            and has been featured in private collections,
            thoughtful spaces and lives lived with curiosity.
          </p>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   NEWSLETTER
   ========================================================= */

function Newsletter() {
  return (
    <section className="newsletter">
      <p className="eyebrow">
        Letters from the studio
      </p>

      <h2>
        New works, quiet notes
        <br />
        and first <em>access.</em>
      </h2>

      <form
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="email"
          placeholder="Your email address"
          aria-label="Email address"
        />

        <button
          type="submit"
          aria-label="Subscribe"
        >
          <ArrowRight />
        </button>
      </form>

      <small>
        By subscribing, you agree to receive occasional
        studio notes.
      </small>
    </section>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
  return (
    <footer>
      <div className="footer-top footer-columns">
        <div>
          <Link className="wordmark" to="/">
            KALANVAY
            <span>CONTEMPORARY ART STUDIO</span>
          </Link>
          <p>Original artworks and considered editions from New Delhi, made for enduring spaces.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link to="/shop">Collection</Link>
          <Link to="/custom-art">Custom Art</Link>
          <Link to="/account">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/account">Account</Link>
        </div>
        <div>
          <p className="footer-label">Studio notes</p>
          <a href="#instagram"><AtSign size={16} /> Instagram</a>
          <a href="mailto:studio@kalanvay.com">studio@kalanvay.com</a>
          <span>New Delhi, India</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Kalanvay
        </span>

        <span>Made with Art. Created with Heart.</span>
      </div>
    </footer>
  );
}

/* =========================================================
   ADMIN OVERVIEW
   ========================================================= */

function Admin() {
  return (
    <main className="admin">
      <aside>
        <span className="admin-logo">KS/</span>

        <nav>
          <a className="selected">Overview</a>
          <a>Artworks</a>
          <a>Orders</a>
          <a>Commissions</a>
          <a>Customers</a>
          <a>Analytics</a>
          <a>Settings</a>
        </nav>
      </aside>

      <section className="admin-content">
        <div className="admin-head">
          <div>
            <p>Tuesday, 17 September</p>
            <h1>Good morning, Karishma.</h1>
          </div>

          <button
            type="button"
            className="button dark"
          >
            Add artwork
            <Plus size={16} />
          </button>
        </div>

        <div className="metrics">
          {[
            ["₹8.4L", "Revenue", "+12.5%"],
            ["24", "Orders", "+8.2%"],
            ["07", "Open commissions", "3 need action"],
            ["03", "Low stock", "View works"],
          ].map((item) => (
            <article key={item[1]}>
              <p>{item[1]}</p>
              <h2>{item[0]}</h2>
              <small>{item[2]}</small>
            </article>
          ))}
        </div>

        <div className="admin-grid">
          <section className="chart">
            <div>
              <h2>Revenue overview</h2>

              <select defaultValue="Last 6 months">
                <option>Last 6 months</option>
              </select>
            </div>

            <div className="bars">
              {[28, 43, 31, 60, 52, 83, 68, 91, 72, 100, 82, 95].map(
                (height, index) => (
                  <i
                    key={index}
                    style={{
                      height: `${height}%`,
                    }}
                  />
                )
              )}
            </div>

            <div className="axis">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </section>

          <section className="admin-list">
            <h2>Needs your attention</h2>

            <article>
              <span className="dot gold" />

              <div>
                <b>New commission request</b>
                <p>
                  Ria Menon · Portrait commission
                </p>
              </div>

              <ArrowUpRight size={15} />
            </article>

            <article>
              <span className="dot" />

              <div>
                <b>
                  Order #KV-1048 awaiting dispatch
                </b>

                <p>Borrowed Light · Delhi</p>
              </div>

              <ArrowUpRight size={15} />
            </article>

            <article>
              <span className="dot muted" />

              <div>
                <b>
                  3 artworks are low in stock
                </b>

                <p>Review inventory</p>
              </div>

              <ArrowUpRight size={15} />
            </article>
          </section>
        </div>

        <section className="orders">
          <div>
            <h2>Recent orders</h2>
            <a>View all</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Artwork</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#KV-1049</td>
                <td>Pranav Shah</td>
                <td>Small Hours</td>
                <td>
                  <i>Paid</i>
                </td>
                <td>₹18,000</td>
              </tr>

              <tr>
                <td>#KV-1048</td>
                <td>Meera Kapoor</td>
                <td>Borrowed Light</td>
                <td>
                  <i>Processing</i>
                </td>
                <td>₹2,45,000</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

/* =========================================================
   AUTH
   ========================================================= */

function AuthPage({ admin = false, initialMode = "register" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAdmin, register: createAccount } = useAuth();
  const [register, setRegister] = useState(initialMode === "register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (register && values.get("password") !== values.get("confirmPassword")) { setError("Passwords do not match."); return; }
    setStatus("loading"); setError("");
    try {
      if (register && !admin) {
        await createAccount({ name: values.get("name"), email: values.get("email"), password: values.get("password") });
      } else if (admin) {
        await loginAdmin({ email: values.get("email"), password: values.get("password") });
      } else {
        await login({ email: values.get("email"), password: values.get("password") });
      }
      navigate(admin ? "/admin/dashboard" : (location.state?.from || "/account"));
    } catch (authError) { setError(authError.message || "We could not complete that request."); setStatus("error"); }
  };

  return (
    <main className="auth-page">
      <Link
        className="wordmark auth-logo"
        to="/"
      >
        KALANVAY
        <span>TRADITION MEETS ART</span>
      </Link>

      <div className="auth-panel">
        <p className="eyebrow">
          {admin
            ? "Kalanvay staff portal"
            : register ? "Join the studio" : "Welcome back"}
        </p>

        <h1>
          {admin
            ? "Admin sign in"
            : register
            ? "Create your Kalanvay account"
            : "Welcome back to Kalanvay"}
        </h1>

        <p className="auth-intro">
          {admin
            ? "Restricted access for Kalanvay administrators."
            : "Save your favourites, view orders and follow your commissions."}
        </p>

        <form onSubmit={submit}>
          {register && !admin && (
            <label>
              Full name
              <input
                required
                name="name"
                placeholder="Karishma Shukla"
              />
            </label>
          )}

          <label>
            Email address

            <input
              required
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password

            <div className="password-field">
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
          </label>

          {register && !admin && (
            <label>
              Confirm password
              <div className="password-field">
                <input
                  required
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  aria-pressed={showConfirmPassword}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
            </label>
          )}

          {!admin && !register && (
            <a className="forgot">
              Forgot password?
            </a>
          )}

          <button
            type="submit"
            className="button dark full"
          >
            {admin
              ? "Enter admin portal"
              : register
              ? "Create account →"
              : "Sign in →"}

            <ArrowRight size={16} />
          </button>
        </form>

        {!admin && (
          <button
            type="button"
            className="switch-auth"
            onClick={() =>
              { setRegister(!register); setError(""); }
            }
          >
            {register
              ? "Already have an account? Sign in"
              : "New to Kalanvay? Create an account"}
          </button>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}

        <Link
          className="back-home"
          to="/"
        >
          ← Return to the gallery
        </Link>
      </div>
    </main>
  );
}

function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <main className="page"><p>Loading your account…</p></main>;
  if (!user) return <Navigate to="/register" replace />;
  return <main className="page account-page"><p className="eyebrow">Your Kalanvay</p><h1>Welcome, {user.name?.split(" ")[0]}.</h1><p>Save your favourites, track your orders and follow your commissions.</p><button className="button gold" onClick={async () => { await logout(); navigate("/"); }}>Sign out <ArrowRight size={16} /></button></main>;
}

/* =========================================================
   CHECKOUT
   ========================================================= */

function Checkout({ cart }) {
  const [paid, setPaid] = useState(false);

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const checkout = (event) => {
    event.preventDefault();

    if (!total) return;

    /*
      IMPORTANT:
      This is still a frontend placeholder.

      Production Razorpay should:
      1. Send cart to backend.
      2. Backend validates prices.
      3. Backend creates Razorpay order.
      4. Frontend opens Razorpay using server order_id.
      5. Backend verifies payment signature.
    */

    if (window.Razorpay) {
      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Kalanvay",
        description: "Artwork purchase",

        handler: () => {
          setPaid(true);
        },
      });

      razorpay.open();
    } else {
      setPaid(true);
    }
  };

  return (
    <main className="checkout page">
      <p className="eyebrow">
        Secure checkout
      </p>

      <h1>Complete your order</h1>

      {paid ? (
        <div className="payment-success">
          <Check size={34} />

          <h2>
            Thank you for your order.
          </h2>

          <p>
            We will send your confirmation to
            the email you provided.
          </p>
        </div>
      ) : (
        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={checkout}
          >
            <h2>Contact</h2>

            <label>
              Email address

              <input
                required
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <h2>Delivery</h2>

            <div className="form-pair">
              <label>
                First name
                <input required />
              </label>

              <label>
                Last name
                <input required />
              </label>
            </div>

            <label>
              Address
              <input required />
            </label>

            <div className="form-pair">
              <label>
                City
                <input required />
              </label>

              <label>
                Postal code
                <input required />
              </label>
            </div>

            <label>
              Phone
              <input required type="tel" />
            </label>

            <h2>Payment</h2>

            <p className="payment-note">
              Payments are secured by Razorpay. Your
              card and UPI information never touches
              Kalanvay’s servers.
            </p>

            <button
              type="submit"
              className="button dark full"
            >
              Pay {money(total)} with Razorpay
              <ArrowRight size={16} />
            </button>
          </form>

          <aside className="summary">
            <h2>Your artworks</h2>

            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt=""
                />

                <span>
                  {item.title} × {item.qty}
                </span>

                <b>
                  {money(
                    item.price * item.qty
                  )}
                </b>
              </div>
            ))}

            <div className="total">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   ADMIN STUDIO
   ========================================================= */

function AdminStudio() {
  const [view, setView] =
    useState("Overview");

  const [notice, setNotice] =
    useState("");

  const [items, setItems] =
    useState(art);

  const save = (event) => {
    event.preventDefault();

    setNotice(
      "Artwork draft saved. Connect this form to POST /api/admin/artworks to publish it."
    );

    event.target.reset();
  };

  return (
    <main className="admin">
      <aside>
        <Link
          className="admin-logo"
          to="/"
        >
          K/
        </Link>

        <nav>
          {[
            "Overview",
            "Artworks",
            "Add artwork",
            "Orders",
            "Commissions",
            "Reviews",
            "Customers",
            "Settings",
          ].map((option) => (
            <button
              type="button"
              key={option}
              className={
                view === option
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setView(option)
              }
            >
              {option}
            </button>
          ))}
        </nav>

        <Link
          className="admin-exit"
          to="/"
        >
          View storefront ↗
        </Link>
      </aside>

      <section className="admin-content">
        <div className="admin-head">
          <div>
            <p>
              KALANVAY · ADMIN PORTAL
            </p>

            <h1>
              {view === "Overview"
                ? "Good morning, Karishma."
                : view}
            </h1>
          </div>

          <button
            type="button"
            className="button dark"
            onClick={() =>
              setView("Add artwork")
            }
          >
            Add artwork
            <Plus size={16} />
          </button>
        </div>

        {notice && (
          <p className="admin-notice">
            <Check size={15} />
            {notice}
          </p>
        )}

        {view === "Add artwork" ? (
          <form
            className="artwork-editor"
            onSubmit={save}
          >
            <div>
              <label>
                Artwork title

                <input
                  required
                  placeholder="e.g. Monsoon Memory"
                />
              </label>

              <div className="form-pair">
                <label>
                  Price (₹)

                  <input
                    required
                    type="number"
                    min="0"
                  />
                </label>

                <label>
                  Stock

                  <select>
                    <option>
                      1 · Original
                    </option>

                    <option>
                      Limited edition
                    </option>

                    <option>
                      Sold out
                    </option>
                  </select>
                </label>
              </div>

              <label>
                Medium

                <input
                  required
                  placeholder="Oil on linen"
                />
              </label>

              <label>
                Dimensions

                <input
                  required
                  placeholder="91 × 122 cm"
                />
              </label>

              <label>
                Description

                <textarea
                  required
                  placeholder="Describe the work, materials, story and care notes..."
                />
              </label>

              <label>
                Category

                <select>
                  <option>
                    Original Paintings
                  </option>

                  <option>
                    Prints
                  </option>

                  <option>
                    Abstract Art
                  </option>

                  <option>
                    Portraits
                  </option>
                </select>
              </label>
            </div>

            <div className="image-drop">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
              />

              <b>
                Upload artwork images
              </b>

              <p>
                JPG, PNG or WebP · max 10 MB
                per file
              </p>

              <small>
                Production: upload directly to
                Cloudinary/S3 using a signed
                server-side upload flow.
              </small>
            </div>

            <button
              type="submit"
              className="button dark"
            >
              Save artwork draft
              <ArrowRight size={16} />
            </button>
          </form>
        ) : view === "Artworks" ? (
          <section className="admin-artworks">
            {items.map((item) => (
              <article key={item.id}>
                <img
                  src={item.image}
                  alt=""
                />

                <div>
                  <b>{item.title}</b>

                  <p>
                    {item.medium} ·{" "}
                    {item.type}
                  </p>
                </div>

                <span>
                  {money(item.price)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setItems((current) =>
                      current.filter(
                        (artwork) =>
                          artwork.id !==
                          item.id
                      )
                    )
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </section>
        ) : view === "Reviews" ? (
          <section className="admin-list review-list">
            <h2>Customer reviews</h2>

            <article>
              <span className="dot gold" />

              <div>
                <b>
                  “A beautiful, deeply
                  considered piece.”
                </b>

                <p>
                  Meera Kapoor · Pending
                  publication
                </p>
              </div>

              <button
                type="button"
                className="button"
                onClick={() =>
                  setNotice(
                    "Review approved and ready to display on the storefront."
                  )
                }
              >
                Approve
              </button>
            </article>
          </section>
        ) : (
          <Admin />
        )}
      </section>
    </main>
  );
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  const [cart, setCart] =
    useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistBusyId, setWishlistBusyId] = useState("");

  useEffect(() => {
    let active = true;

    if (!user) {
      setWishlistIds(new Set());
      return undefined;
    }

    getWishlist()
      .then((items) => {
        if (active) setWishlistIds(new Set(items.map((item) => item.artworkId)));
      })
      .catch(() => {
        if (active) setWishlistIds(new Set());
      });

    return () => {
      active = false;
    };
  }, [user]);

  const toggleWishlist = async (item) => {
    if (!user) {
      navigate("/login", { state: { from: `/artwork/${item.slug || item.id}` } });
      return;
    }

    const artworkId = String(item.id);
    const wasSaved = wishlistIds.has(artworkId);
    setWishlistBusyId(artworkId);

    try {
      if (wasSaved) {
        await removeWishlistItem(artworkId);
        setWishlistIds((current) => {
          const next = new Set(current);
          next.delete(artworkId);
          return next;
        });
      } else {
        await addWishlistItem(artworkId);
        setWishlistIds((current) => new Set(current).add(artworkId));
      }
    } catch (error) {
      // Keep the database as the source of truth; failed actions are not optimistically persisted.
      window.alert(error.message || "We could not update your wishlist. Please try again.");
    } finally {
      setWishlistBusyId("");
    }
  };

  const wishlistProps = (item) => ({
    isWishlisted: wishlistIds.has(String(item.id)),
    onWishlist: toggleWishlist,
    wishlistBusy: wishlistBusyId === String(item.id),
  });

  const add = (item) => {
    setCart((current) => {
      const existing = current.find(
        (cartItem) =>
          cartItem.id === item.id
      );

      if (existing) {
        return current.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  qty:
                    cartItem.qty + 1,
                }
              : cartItem
        );
      }

      return [
        ...current,
        {
          ...item,
          qty: 1,
        },
      ];
    });
  };

  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith(
      "/admin"
    );

  const isBare = isAdmin || location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <ScrollToTop />
      {!isBare && (
        <Header cart={cart} wishlistCount={wishlistIds.size} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Home add={add} wishlistProps={wishlistProps} />}
            />

            <Route
              path="/shop"
              element={<Shop add={add} wishlistProps={wishlistProps} />}
            />

            <Route
              path="/artwork/:id"
              element={
                <Product add={add} wishlistProps={wishlistProps} />
              }
            />

            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  setCart={setCart}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout cart={cart} />
              }
            />

            <Route
              path="/custom-art"
              element={<Commission />}
            />

            <Route
              path="/login"
              element={<AuthPage initialMode="login" />}
            />

            <Route
              path="/register"
              element={<AuthPage initialMode="register" />}
            />

            <Route
              path="/account"
              element={<Account />}
            />

            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />

            <Route
              path="/admin/login"
              element={
                <AuthPage admin />
              }
            />

            <Route
              element={<AdminRoute />}
            >
              <Route
                path="/admin/dashboard"
                element={<AdminStudio />}
              />
            </Route>

            <Route
              path="*"
              element={<Home add={add} wishlistProps={wishlistProps} />}
            />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isBare && <Footer />}
    </>
  );
}

/* =========================================================
   START APPLICATION
   ========================================================= */

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Kalanvay: Could not find <div id="root"></div> in index.html.'
  );
}

createRoot(rootElement).render(
  <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);
