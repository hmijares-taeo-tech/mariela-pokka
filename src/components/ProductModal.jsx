import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag, Sparkles, Shield, Compass, ChevronRight } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

export default function ProductModal({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  onOpenBespoke
}) {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.gallery?.[0] || product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'FR 36');
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || 'Midnight Noir');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    setActiveImage(product.gallery?.[0] || product.image);
    setSelectedSize(product.sizes?.[0] || 'FR 36');
    setSelectedColor(product.availableColors?.[0] || 'Midnight Noir');
    setAddedNotice(false);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      selectedImage: activeImage
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'rgba(5, 5, 8, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        background: '#0e0e14',
        border: '1px solid rgba(223, 196, 125, 0.3)',
        borderRadius: '4px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(223, 196, 125, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        overflow: 'hidden'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(223, 196, 125, 0.3)',
            color: 'var(--gold-light)',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(223, 196, 125, 0.2)')}
          onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.05)')}
          aria-label="Close creation details"
        >
          <X size={18} />
        </button>

        {/* Left Column: Visual Gallery */}
        <div style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #151520 0%, #0c0c11 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Main Photo with Frame */}
          <div style={{
            width: '100%',
            maxHeight: '440px',
            overflow: 'hidden',
            borderRadius: '2px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
            marginBottom: '1.5rem',
            border: '1px solid rgba(223, 196, 125, 0.2)'
          }}>
            <img
              src={activeImage}
              alt={product.title}
              style={{
                width: '100%',
                height: '440px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease'
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          {product.gallery && product.gallery.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {product.gallery.map((imgSrc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgSrc)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: activeImage === imgSrc ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                    opacity: activeImage === imgSrc ? 1 : 0.6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.title} view ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Piece Details & Commission */}
        <div style={{
          padding: '2.5rem 2.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          maxHeight: '92vh'
        }}>
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase',
                background: 'rgba(223, 196, 125, 0.1)',
                padding: '0.25rem 0.65rem',
                borderRadius: '2px'
              }}>
                {product.badge || 'Haute Couture'}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {product.categoryLabel}
              </span>
            </div>

            {/* Title & Tagline */}
            <h2 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.85rem',
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '0.4rem'
            }}>
              {product.title}
            </h2>

            <p style={{
              fontFamily: 'var(--font-serif-editorial)',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: 'var(--gold-light)',
              marginBottom: '1.25rem'
            }}>
              {product.tagline}
            </p>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#ffffff'
              }}>
                {formatPrice(product, currency)}
              </span>
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)'
              }}>
                Complimentary Worldwide Insured Delivery
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '1.5rem'
            }}>
              {product.description}
            </p>

            {/* Craftsmanship Highlights */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '2px',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}>
                Atelier Specifications
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.details?.map((detail, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#c5c4c0' }}>
                    <Check size={13} color="var(--gold-primary)" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Selection */}
            {product.availableColors && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem'
                }}>
                  Selected Shade: <strong style={{ color: 'var(--gold-light)' }}>{selectedColor}</strong>
                </span>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.75rem',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        background: selectedColor === color ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.04)',
                        color: selectedColor === color ? '#0d0d12' : 'var(--text-secondary)',
                        border: selectedColor === color ? 'none' : '1px solid rgba(255,255,255,0.12)',
                        fontWeight: selectedColor === color ? 600 : 400,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizing Selection */}
            {product.sizes && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase'
                  }}>
                    Select Silhouette Size
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBespoke();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-primary)',
                      fontSize: '0.7rem',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Bespoke Sizing Assistance
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-serif-display)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        background: selectedSize === sz ? 'rgba(223, 196, 125, 0.2)' : 'rgba(255,255,255,0.03)',
                        color: selectedSize === sz ? 'var(--gold-light)' : 'var(--text-secondary)',
                        border: selectedSize === sz ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem'
          }}>
            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              {addedNotice ? (
                <>
                  <Check size={16} />
                  <span>Added to Private Selection</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Acquire for Private Wardrobe</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBespoke();
              }}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Sparkles size={15} color="var(--gold-primary)" />
              <span>Request Made-to-Measure Commission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
