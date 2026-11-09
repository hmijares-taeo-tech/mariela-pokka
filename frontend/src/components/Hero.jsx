import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, ChevronRight, ArrowDown } from 'lucide-react';
import { BRAND } from '../data/brandData';

const HERO_SLIDES = [
  {
    image: '/images/hero-model-red.jpg',
    tag: 'Haute Couture Runway',
    title: 'The Arctic Scarlet Trench',
    caption: 'Handcrafted in Finnish Lapland from rare aurora-dyed reindeer leather'
  },
  {
    image: '/images/model-1.jpg',
    tag: 'Monaco Fashion Week',
    title: 'The Midnight Noir Grand Coat',
    caption: 'Full-length architectural elegance, lined in pure Italian mulberry silk'
  },
  {
    image: '/images/model-5.jpg',
    tag: 'Urban Arctic Luxury',
    title: 'The Polar Night Moto Jacket',
    caption: 'Asymmetrical silhouette with butter-soft velvet touch and Swiss hardware'
  }
];

export const HERO_METRICS = [
  { value: '66° 33′ N', label: 'Arctic Circle Atelier', detail: 'Rovaniemi, Finnish Lapland' },
  { value: '100% Ethical', label: 'Sustainable Reindeer Hide', detail: 'Free-roaming Arctic herds' },
  { value: '0.6 mm', label: 'The Silk of the North', detail: 'Featherweight velvety leather' },
  { value: 'Monaco Catwalk', label: 'Haute Couture Debut', detail: 'Global fashion acclaim' }
];

export default function Hero({ onExploreCollections, onOpenShop }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '110px',
        paddingBottom: '3rem',
        overflow: 'hidden',
        background: '#07070a'
      }}
    >
      {/* Background Slides with Crossfade */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: idx === currentSlide ? 1 : 0,
              transition: 'opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1), transform 9s ease-out',
              transform: idx === currentSlide ? 'scale(1.04)' : 'scale(1)',
              background: `linear-gradient(to right, rgba(8, 8, 11, 0.94) 0%, rgba(8, 8, 11, 0.72) 48%, rgba(8, 8, 11, 0.45) 100%), url(${slide.image}) center center/cover no-repeat`
            }}
          />
        ))}

        {/* Ambient Twilight Vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 80% 30%, rgba(207, 58, 54, 0.12) 0%, transparent 60%), linear-gradient(to top, #08080b 0%, transparent 35%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Hero Content */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '1440px',
        paddingTop: '2rem'
      }}>
        {/* Top Coordinates & Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div className="section-badge">
            <span className="badge-dot" />
            <span>Arctic Circle • Lapland Finland</span>
          </div>

          <span style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            color: 'var(--gold-light)',
            opacity: 0.85
          }}>
            66°33′ N, 25°43′ E
          </span>
        </div>

        {/* Grand Headline */}
        <h1 style={{
          fontFamily: 'var(--font-serif-display)',
          fontSize: 'clamp(2.6rem, 5.8vw, 5.2rem)',
          fontWeight: 400,
          lineHeight: 1.06,
          letterSpacing: '0.04em',
          color: '#ffffff',
          maxWidth: '920px',
          marginBottom: '1.5rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)'
        }}>
          Arctic Luxury <br />
          <span className="text-gold-gradient gold-glow" style={{ fontWeight: 600 }}>
            Woven by Nature
          </span>
        </h1>

        {/* Subtitle / Philosophy */}
        <p style={{
          fontFamily: 'var(--font-serif-editorial)',
          fontSize: 'clamp(1.25rem, 2.2vw, 1.8rem)',
          fontStyle: 'italic',
          color: '#e4e2de',
          maxWidth: '720px',
          lineHeight: 1.45,
          marginBottom: '2.5rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)'
        }}>
          Timeless designs, handcrafted in Finland from the world’s most exclusive reindeer leather — the Silk of the North.
        </p>

        {/* CTA Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => (onOpenShop ? onOpenShop('all') : onExploreCollections())}
            className="btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            <span>Enter Online Boutique</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={onExploreCollections}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <Sparkles size={15} color="var(--gold-primary)" />
            <span>Explore Lookbook</span>
          </button>
        </div>

        {/* Slide Indicators & Current Look Preview */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(18, 18, 25, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(223, 196, 125, 0.2)',
          borderRadius: '4px',
          width: 'fit-content',
          maxWidth: '100%'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? '32px' : '10px',
                  height: '4px',
                  borderRadius: '2px',
                  background: i === currentSlide ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease'
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div style={{
            borderLeft: '1px solid rgba(223, 196, 125, 0.2)',
            paddingLeft: '1rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase'
            }}>
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <span style={{
              fontSize: '0.78rem',
              color: '#f5f4f0',
              fontWeight: 500
            }}>
              {HERO_SLIDES[currentSlide].title}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="container" style={{ position: 'relative', zIndex: 2, marginTop: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          background: 'rgba(15, 15, 22, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(223, 196, 125, 0.15)',
          borderRadius: '4px',
          padding: '1.25rem 1.75rem'
        }}>
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--gold-light)',
                letterSpacing: '0.04em'
              }}>
                {metric.value}
              </span>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                marginTop: '0.2rem'
              }}>
                {metric.label}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.1rem'
              }}>
                {metric.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
