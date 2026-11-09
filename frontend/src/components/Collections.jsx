import React, { useState, useEffect } from 'react';
import { Eye, ShoppingBag, Sparkles, ArrowRight, Database } from 'lucide-react';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/brandData';
import { formatPrice } from '../utils/formatCurrency';
import { fetchMedusaProducts } from '../services/medusa';

const CATEGORIES = [
  { id: 'all', label: 'All Creations' },
  { id: 'outerwear', label: 'Trenches & Outerwear' },
  { id: 'jackets', label: 'Jackets & Suits' },
  { id: 'dresses', label: 'Dresses & Skirts' },
  { id: 'pants', label: 'Pants & Shorts' },
  { id: 'blouses', label: 'Blouses & Tops' },
  { id: 'accessories', label: 'Accessories & Gloves' }
];

export default function Collections({
  currency,
  onSelectProduct,
  onAddToCart,
  onOpenShop
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [isMedusaConnected, setIsMedusaConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const liveProducts = await fetchMedusaProducts();
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
          setIsMedusaConnected(true);
        }
      } catch (err) {
        console.warn("Using fallback catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const curatedPreview = filteredProducts.slice(0, 6);

  return (
    <section id="collections" style={{
      padding: '7rem 0',
      background: '#09090d',
      position: 'relative'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3.5rem auto' }}>
          <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
            <span className="badge-dot" />
            <span>Arctic Haute Couture</span>
          </div>

          <h2 className="section-title">
            The Signature Collections
          </h2>

          <p className="section-subtitle" style={{ margin: '0 auto 1.5rem auto' }}>
            Masterfully sculpted from Arctic reindeer leather. Each creation unites weightless softness with generational durability, tailored by hand at 66°33′ N.
          </p>

          {isMedusaConnected && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>Live Medusa Backend Connected ({products.length} Handcrafted Creations)</span>
            </div>
          )}
        </div>

        {/* Filter Categories */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === cat.id ? '#0d0d12' : 'var(--text-secondary)',
                border: activeCategory === cat.id ? 'none' : '1px solid rgba(223, 196, 125, 0.18)',
                padding: '0.65rem 1.4rem',
                borderRadius: '2px',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.74rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeCategory === cat.id ? '0 4px 20px rgba(223, 196, 125, 0.3)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (Curated Home Showcase) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {curatedPreview.map((product) => (
            <div
              key={product.id}
              className="glass-card"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                cursor: 'pointer'
              }}
              onClick={() => onSelectProduct(product)}
            >
              {/* Product Image Container */}
              <div style={{
                position: 'relative',
                height: '420px',
                overflow: 'hidden',
                background: '#12121a'
              }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />

                {/* Badge Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(9, 9, 13, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(223, 196, 125, 0.3)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)'
                }}>
                  {product.badge}
                </div>

                {/* Quick Examine Button Overlay on Hover */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(9, 9, 13, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(223, 196, 125, 0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-light)'
                }}>
                  <Eye size={18} />
                </div>
              </div>

              {/* Card Meta & Details */}
              <div style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '0.4rem'
                  }}>
                    {product.categoryLabel}
                  </span>

                  <h3 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    marginBottom: '0.4rem',
                    lineHeight: 1.2
                  }}>
                    {product.title}
                  </h3>

                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.tagline}
                  </p>
                </div>

                <div>
                  {/* Price & Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-serif-display)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--gold-light)'
                    }}>
                      {formatPrice(product, currency)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="btn-text"
                      style={{ fontSize: '0.72rem' }}
                    >
                      <span>Examine Creation</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enter Full Online Boutique CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '5rem',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: 'var(--font-serif-editorial)',
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: 'var(--text-secondary)'
          }}>
            Showing {curatedPreview.length} curated highlights of {filteredProducts.length} creations in this selection.
          </p>
          <button
            onClick={() => onOpenShop && onOpenShop(activeCategory)}
            className="btn-primary"
            style={{
              padding: '1rem 2.6rem',
              fontSize: '0.82rem',
              letterSpacing: '0.18em'
            }}
          >
            <ShoppingBag size={16} />
            <span>Enter Full Online Boutique ({products.length} Creations & Filters)</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Concierge Bespoke Callout Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.8) 0%, rgba(13, 13, 18, 0.95) 100%)',
          border: '1px solid rgba(223, 196, 125, 0.25)',
          borderRadius: '4px',
          padding: '2.5rem 3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              display: 'block',
              marginBottom: '0.4rem'
            }}>
              Private Client Experience
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.45rem',
              color: '#ffffff',
              marginBottom: '0.4rem'
            }}>
              Complimentary Insured Worldwide White-Glove Courier
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
              Every creation is dispatched directly from our Arctic atelier at 66°33′ N in signature gold-embossed keepsake presentation cases with certificate of provenance.
            </p>
          </div>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Sparkles size={15} />
            <span>House Concierge Inquiry</span>
          </button>
        </div>
      </div>
    </section>
  );
}
