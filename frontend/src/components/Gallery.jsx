import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/brandData';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const collections = ['All', 'Signature Trench', 'Haute Couture', 'Accessories', 'Editorial Press', 'Lookbook'];

  const filteredImages = activeFilter === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.collection === activeFilter);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <section id="gallery" style={{
      padding: '7rem 0',
      background: '#07070a',
      position: 'relative'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
            <span className="badge-dot" />
            <span>Haute Couture Archive</span>
          </div>

          <h2 className="section-title">
            The Atelier Lookbook
          </h2>

          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            An intimate visual record of our creations—from the snowy expanses of Lapland to the catwalks of Monaco.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setActiveFilter(col)}
              style={{
                background: activeFilter === col ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.03)',
                color: activeFilter === col ? '#0d0d12' : 'var(--text-secondary)',
                border: activeFilter === col ? 'none' : '1px solid rgba(223, 196, 125, 0.18)',
                padding: '0.55rem 1.2rem',
                borderRadius: '2px',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: activeFilter === col ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredImages.map((img, idx) => (
            <div
              key={img.src}
              className="glass-card"
              style={{
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden',
                height: '380px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={img.src}
                alt={img.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              />

              {/* Hover Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(9, 9, 13, 0.95) 0%, rgba(9, 9, 13, 0.2) 60%, transparent 100%)',
                opacity: 0.9,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.5rem',
                transition: 'opacity 0.3s ease'
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  color: 'var(--gold-primary)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.2rem'
                }}>
                  <MapPin size={12} />
                  <span>{img.location}</span>
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  lineHeight: 1.2
                }}>
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 120,
          background: 'rgba(5, 5, 8, 0.96)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Controls */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(223, 196, 125, 0.3)',
              color: 'var(--gold-light)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)}
            style={{
              position: 'absolute',
              left: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(223, 196, 125, 0.3)',
              color: 'var(--gold-light)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredImages.length)}
            style={{
              position: 'absolute',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(223, 196, 125, 0.3)',
              color: 'var(--gold-light)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>

          {/* Main Large Image */}
          <div style={{
            maxWidth: '90vw',
            maxHeight: '75vh',
            borderRadius: '3px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(223, 196, 125, 0.1)',
            border: '1px solid rgba(223, 196, 125, 0.3)',
            marginBottom: '1.25rem'
          }}>
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Caption */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.35rem',
              color: '#ffffff',
              marginBottom: '0.25rem'
            }}>
              {filteredImages[lightboxIndex].title}
            </h3>
            <span style={{
              fontFamily: 'var(--font-serif-editorial)',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--gold-light)'
            }}>
              {filteredImages[lightboxIndex].location} • {filteredImages[lightboxIndex].collection}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
